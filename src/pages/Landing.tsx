import type { CSSProperties } from "react";
import Hero from "../components/Hero";
import Section from "../components/Section";
import KPIStrip from "../components/KPIStrip";
import AnalysisCard from "../components/AnalysisCard";
import Methodology from "../components/Methodology";
import Dashboard from "../components/Dashboard";
import About from "../components/About";
import { ANALYSES } from "../data/analyses";

export default function Landing() {
  return (
    <>
      <Hero />

      <section id="overview" className="pb-12 scroll-mt-24">
        <KPIStrip />
      </section>

      <Section
        id="analyses"
        eyebrow="Deep dives"
        title="Five analyses, one customer dataset."
      >
        <p className="text-base text-[color:var(--color-muted)] max-w-prose mb-8">
          Each analysis mirrors a real marketing reporting workflow — from
          where customers come from, through what they do, to who they're
          worth. Click any card to see the business question, the SQL, the
          techniques used, and the takeaway.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {ANALYSES.map((a, i) => (
            <div
              key={a.slug}
              className="stagger-item h-full"
              style={
                {
                  ["--stagger-delay" as never]: `${260 + i * 90}ms`,
                } as CSSProperties
              }
            >
              <AnalysisCard analysis={a} />
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="dashboard"
        eyebrow="Visualization"
        title="Tableau dashboard."
      >
        <Dashboard />
      </Section>

      <Section
        id="methodology"
        eyebrow="How the dataset maps"
        title="Column mapping approach."
      >
        <Methodology />
      </Section>

      <Section id="about" eyebrow="About" title="Who built this.">
        <About />
      </Section>
    </>
  );
}
