import { useEffect, useState } from "react";

/**
 * Rotating findings visualization.
 *
 * Cycles through three snapshots pulled from the actual analyses so the
 * hero graphic tells the real story of what the queries produce:
 *   1. Revenue by channel (analysis 04)
 *   2. Conversion funnel (analysis 02)
 *   3. RFM segments      (analysis 05)
 *
 * Each view crossfades, bars fill with stagger, and a dot indicator at
 * the bottom shows which view is currently active.
 */
type BarItem = { label: string; value: number; display: string };
type View = {
  id: string;
  title: string;
  items: BarItem[];
  footnote: string;
};

const VIEWS: View[] = [
  {
    id: "channels",
    title: "Revenue by channel",
    items: [
      { label: "Electronics", value: 18358, display: "$18.4k" },
      { label: "Clothing", value: 15826, display: "$15.8k" },
      { label: "Home Goods", value: 15306, display: "$15.3k" },
      { label: "Sports", value: 13073, display: "$13.1k" },
      { label: "Groceries", value: 8075, display: "$8.1k" },
    ],
    footnote: "analysis 04 · campaign ROI",
  },
  {
    id: "funnel",
    title: "Conversion funnel",
    items: [
      { label: "All Users", value: 1000, display: "1,000" },
      { label: "Engaged", value: 612, display: "612" },
      { label: "Active Buyers", value: 318, display: "318" },
      { label: "High-Value", value: 184, display: "184" },
    ],
    footnote: "analysis 02 · funnel conversion",
  },
  {
    id: "rfm",
    title: "RFM segments",
    items: [
      { label: "Mid Value", value: 511, display: "511" },
      { label: "Low Value", value: 271, display: "271" },
      { label: "High Value", value: 218, display: "218" },
    ],
    footnote: "analysis 05 · RFM segmentation",
  },
];

const ROTATE_MS = 5200;

export default function HeroVisual() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIdx((i) => (i + 1) % VIEWS.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, []);

  const view = VIEWS[idx];
  const max = Math.max(...view.items.map((i) => i.value));

  return (
    <div className="relative aspect-[4/5] w-full max-w-md mx-auto md:mx-0 md:ml-auto rounded-2xl overflow-hidden border border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
      {/* Subtle gradient wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 80% 15%, rgba(194,91,63,0.10), transparent 60%), radial-gradient(90% 60% at 20% 95%, rgba(31,29,26,0.05), transparent 60%)",
        }}
      />

      {/* Top label */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-[10px] tracking-[0.25em] uppercase text-[color:var(--color-muted)]">
        <span key={`label-${view.id}`} className="hv-label-fade">
          {view.title}
        </span>
        <span className="hv-pulse inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]" />
          live
        </span>
      </div>

      {/* Bar chart — keyed on view so it remounts and re-animates */}
      <div
        key={view.id}
        className="absolute inset-x-0 top-16 bottom-16 px-6 flex flex-col justify-center gap-3"
      >
        {view.items.map((item, i) => (
          <div
            key={item.label}
            className="hv-row flex items-center gap-3"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="w-[38%] text-[11px] text-[color:var(--color-ink)]/90 truncate">
              {item.label}
            </div>
            <div className="flex-1 h-5 bg-[color:var(--color-bg)]/70 rounded overflow-hidden relative">
              <div
                className="hv-bar-fill absolute inset-y-0 left-0 bg-[color:var(--color-accent)]/85 rounded"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  animationDelay: `${i * 90 + 100}ms`,
                }}
              />
            </div>
            <div className="w-[20%] mono text-[11px] text-[color:var(--color-muted)] text-right tabular-nums">
              {item.display}
            </div>
          </div>
        ))}
      </div>

      {/* Footnote (query reference) */}
      <div className="absolute bottom-10 left-5 right-5 text-[9px] mono tracking-[0.15em] uppercase text-[color:var(--color-muted)] text-right">
        <span key={`fn-${view.id}`} className="hv-label-fade">
          {view.footnote}
        </span>
      </div>

      {/* View indicator dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {VIEWS.map((v, i) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`Show ${v.title}`}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
              i === idx
                ? "w-6 bg-[color:var(--color-accent)]"
                : "w-1.5 bg-[color:var(--color-line)] hover:bg-[color:var(--color-muted)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
