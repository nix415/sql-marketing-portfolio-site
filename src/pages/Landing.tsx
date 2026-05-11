import type { CSSProperties } from "react";
import Hero from "../components/Hero";
import KPIStrip from "../components/KPIStrip";
import PageHeader from "../components/PageHeader";
import AnalysisCard from "../components/AnalysisCard";
import Dashboard from "../components/Dashboard";
import Methodology from "../components/Methodology";
import About from "../components/About";
import { ANALYSES } from "../data/analyses";

export default function Landing() {
  return (
    <>
      <section id="overview" className="scroll-mt-24">
        <Hero />
        <div className="pb-24">
          <KPIStrip />
        </div>
      </section>

      <section
        id="analyses"
        className="scroll-mt-24 border-t border-[color:var(--color-line)]"
      >
        <PageHeader
          eyebrow="Deep dives"
          title="Five analyses, one customer dataset."
          description="Every analysis runs in SQL against Kaggle's Customer Segmentation Data for Marketing Analysis (1,000 customers). Each one mirrors a real marketing reporting workflow — from where customers come from, through what they do, to who they're worth. Click any card for the business question, the SQL, techniques, and the takeaway."
        />
        <div className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {ANALYSES.map((a, i) => (
              <div
                key={a.slug}
                className="h-full hero-rise"
                style={
                  {
                    "--hero-delay": `${320 + i * 90}ms`,
                  } as CSSProperties
                }
              >
                <AnalysisCard analysis={a} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="dashboard"
        className="scroll-mt-24 border-t border-[color:var(--color-line)]"
      >
        <PageHeader
          eyebrow="Visualization"
          title="Tableau dashboard."
          description="The same five analyses, visualized interactively — channel mix, funnel drop-off, cohort retention, revenue ROI, and RFM segments in one explorable dashboard."
        />
        <div
          className="mx-auto max-w-6xl px-6 pb-24 hero-rise"
          style={{ "--hero-delay": "320ms" } as CSSProperties}
        >
          <Dashboard />
        </div>
      </section>

      <section
        id="methodology"
        className="scroll-mt-24 border-t border-[color:var(--color-line)]"
      >
        <PageHeader
          eyebrow="How the dataset maps"
          title="Column mapping approach."
          description="Kaggle's Customer Segmentation Data for Marketing Analysis has no event stream, no attribution columns, and no signup timestamps. These mappings turn the fields it does have into the marketing analytics it doesn't — so the five SQL analyses stay faithful to how a growth team actually works."
        />
        <div
          className="mx-auto max-w-6xl px-6 pb-24 hero-rise"
          style={{ "--hero-delay": "320ms" } as CSSProperties}
        >
          <Methodology />
        </div>
      </section>

      <section
        id="about"
        className="scroll-mt-24 border-t border-[color:var(--color-line)]"
      >
        <PageHeader eyebrow="About" title="Who built this." />
        <div
          className="mx-auto max-w-6xl px-6 pb-8 hero-rise"
          style={{ "--hero-delay": "220ms" } as CSSProperties}
        >
          <About />
        </div>
      </section>
    </>
  );
}
