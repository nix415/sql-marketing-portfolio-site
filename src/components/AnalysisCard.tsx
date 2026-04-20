import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Analysis } from "../data/analyses";

export default function AnalysisCard({ analysis }: { analysis: Analysis }) {
  return (
    <Link
      to={`/analyses/${analysis.slug}`}
      className="press group relative flex flex-col h-full rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-6 md:p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[color:var(--color-ink)]"
    >
      <div className="flex items-start justify-between mb-5">
        <span className="mono text-xs tracking-widest text-[color:var(--color-muted)]">
          {analysis.number}
        </span>
        <ArrowUpRight className="h-4 w-4 text-[color:var(--color-muted)] group-hover:text-[color:var(--color-accent)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
      </div>

      <h3 className="display text-2xl leading-tight group-hover:text-[color:var(--color-accent)] transition-colors">
        {analysis.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted)] flex-1">
        {analysis.oneLiner}
      </p>

      <div className="mt-6 pt-5 border-t border-[color:var(--color-line)] flex flex-wrap gap-1.5">
        {analysis.techniques.slice(0, 3).map((t) => (
          <span
            key={t}
            className="mono text-[11px] px-2 py-0.5 rounded bg-[color:var(--color-bg)] text-[color:var(--color-muted)]"
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
