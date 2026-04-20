import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { ANALYSES, getAnalysisBySlug } from "../data/analyses";
import SqlBlock from "../components/SqlBlock";
import ResultTable from "../components/ResultTable";

export default function AnalysisDetail() {
  const { slug } = useParams<{ slug: string }>();
  const analysis = getAnalysisBySlug(slug ?? "");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!analysis) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-32 text-center">
        <h1 className="display text-3xl mb-4">Analysis not found</h1>
        <p className="text-[color:var(--color-muted)] mb-8">
          That analysis slug doesn't exist. Head back to the overview to find
          it.
        </p>
        <Link
          to="/analyses"
          className="press inline-flex items-center gap-2 text-[color:var(--color-accent)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to analyses
        </Link>
      </div>
    );
  }

  const idx = ANALYSES.findIndex((a) => a.slug === analysis.slug);
  const prev = idx > 0 ? ANALYSES[idx - 1] : null;
  const next = idx < ANALYSES.length - 1 ? ANALYSES[idx + 1] : null;
  const sqlFile = `/queries/${analysis.number}_${
    {
      "01": "traffic_acquisition_analysis",
      "02": "funnel_conversion_analysis",
      "03": "cohort_retention_analysis",
      "04": "revenue_campaign_roi",
      "05": "rfm_segmentation",
    }[analysis.number]
  }.sql`;

  return (
    <article className="mx-auto max-w-4xl px-6 py-12 md:py-16">
      <Link
        to="/analyses"
        className="press inline-flex items-center gap-1.5 text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] mb-10"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All analyses
      </Link>

      <header className="mb-12">
        <p className="mono text-xs tracking-[0.3em] uppercase text-[color:var(--color-muted)] mb-4">
          Analysis · {analysis.number}
        </p>
        <h1 className="display text-4xl md:text-5xl leading-[1.05] mb-5">
          {analysis.title}
        </h1>
        <p className="text-lg leading-relaxed text-[color:var(--color-muted)] max-w-3xl">
          {analysis.oneLiner}
        </p>

        <div className="grid grid-cols-3 gap-px bg-[color:var(--color-line)] rounded-xl overflow-hidden border border-[color:var(--color-line)] mt-10">
          {analysis.highlights.map((h) => (
            <div key={h.label} className="bg-[color:var(--color-bg)] p-4 md:p-5">
              <div className="display text-2xl md:text-3xl tabular-nums">
                {h.value}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
                {h.label}
              </div>
            </div>
          ))}
        </div>
      </header>

      <section className="mb-14 grid md:grid-cols-2 gap-8">
        <div className="rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-6">
          <p className="mono text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-2">
            Business question
          </p>
          <p className="text-[15px] leading-relaxed">
            {analysis.businessQuestion}
          </p>
        </div>
        <div className="rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-6">
          <p className="mono text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-2">
            Approach
          </p>
          <p className="text-[15px] leading-relaxed">{analysis.approach}</p>
        </div>
      </section>

      <section className="mb-14">
        <p className="mono text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-3">
          Techniques
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {analysis.techniques.map((t) => (
            <li
              key={t}
              className="mono text-[12px] px-2.5 py-1 rounded bg-[color:var(--color-surface)] text-[color:var(--color-ink)] border border-[color:var(--color-line)]"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-12">
        {analysis.queries.map((q, i) => (
          <div key={i}>
            <div className="flex items-baseline justify-between gap-4 mb-2">
              <h2 className="display text-xl md:text-2xl">{q.label}</h2>
              <span className="mono text-[11px] text-[color:var(--color-muted)]">
                query {i + 1}/{analysis.queries.length}
              </span>
            </div>
            <p className="text-sm text-[color:var(--color-muted)] mb-4 max-w-3xl">
              {q.description}
            </p>
            <SqlBlock sql={q.sql} />
            {q.result && (
              <div className="mt-4">
                <ResultTable table={q.result} />
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="mt-16 rounded-2xl border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent-soft)]/30 p-7 md:p-8">
        <p className="mono text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-accent)] mb-2">
          Takeaway
        </p>
        <p className="text-base md:text-lg leading-relaxed text-[color:var(--color-ink)]">
          {analysis.takeaway}
        </p>
      </section>

      <section className="mt-10 flex items-center justify-between text-sm">
        <a
          href={sqlFile}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex items-center gap-1.5 text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]"
        >
          Open raw .sql file <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </section>

      <nav className="mt-14 grid grid-cols-2 gap-3">
        {prev ? (
          <Link
            to={`/analyses/${prev.slug}`}
            className="press group rounded-xl border border-[color:var(--color-line)] p-4 hover:border-[color:var(--color-ink)] transition-colors"
          >
            <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-muted)] mb-1">
              ← Previous · {prev.number}
            </div>
            <div className="display text-base group-hover:text-[color:var(--color-accent)] transition-colors">
              {prev.title}
            </div>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/analyses/${next.slug}`}
            className="press group rounded-xl border border-[color:var(--color-line)] p-4 hover:border-[color:var(--color-ink)] transition-colors text-right"
          >
            <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-muted)] mb-1 inline-flex items-center gap-1">
              Next · {next.number} <ArrowRight className="h-3 w-3" />
            </div>
            <div className="display text-base group-hover:text-[color:var(--color-accent)] transition-colors">
              {next.title}
            </div>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
