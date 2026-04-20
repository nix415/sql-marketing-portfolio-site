import { ExternalLink } from "lucide-react";
import { SITE } from "../data/site";

export default function Dashboard() {
  if (SITE.tableau.enabled && SITE.tableau.embedUrl) {
    return (
      <div className="rounded-2xl overflow-hidden border border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
        <iframe
          src={SITE.tableau.embedUrl}
          title="Tableau dashboard"
          className="w-full aspect-[16/10] block"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--color-line)] bg-[color:var(--color-surface)]/50 p-10 md:p-14 text-center">
      <div className="mx-auto max-w-md">
        <div className="mono text-xs tracking-[0.25em] uppercase text-[color:var(--color-muted)] mb-3">
          Tableau · placeholder
        </div>
        <h3 className="display text-2xl mb-3">
          Interactive dashboard coming soon
        </h3>
        <p className="text-sm text-[color:var(--color-muted)] mb-6">
          A Tableau Public dashboard with the same five views — channel mix,
          funnel, cohorts, revenue ROI, and RFM — is being built. Once
          published, the embed URL drops into{" "}
          <code className="mono text-[color:var(--color-ink)]">
            src/data/site.ts
          </code>{" "}
          and shows up here.
        </p>
        <a
          href={SITE.tableau.publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex items-center gap-2 text-sm text-[color:var(--color-accent)] hover:underline"
        >
          Tableau Public profile
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
