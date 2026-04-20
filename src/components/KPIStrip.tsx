import type { CSSProperties } from "react";
import { useInView } from "../hooks/useInView";
import { SITE } from "../data/site";

export default function KPIStrip() {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`mx-auto max-w-6xl px-6 reveal ${inView ? "is-visible" : ""}`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[color:var(--color-line)] rounded-2xl overflow-hidden border border-[color:var(--color-line)]">
        {SITE.kpis.map((k, i) => (
          <div
            key={k.label}
            className="bg-[color:var(--color-bg)] p-6 md:p-8 stagger-item relative"
            style={{
              ["--stagger-delay" as never]: `${i * 80}ms`,
            }}
          >
            <div
              className="display text-4xl md:text-5xl tabular-nums leading-none"
              style={{ fontFeatureSettings: "'tnum'" }}
            >
              {k.value}
            </div>
            <div className="mt-3 text-xs uppercase tracking-[0.25em] text-[color:var(--color-muted)]">
              {k.label}
            </div>
            {inView && (
              <span
                className="absolute left-6 right-6 bottom-4 h-px bg-[color:var(--color-accent)] kpi-underline"
                style={
                  {
                    ["--kpi-delay" as never]: `${i * 80 + 200}ms`,
                  } as CSSProperties
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
