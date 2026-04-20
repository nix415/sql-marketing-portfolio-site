import type { CSSProperties } from "react";
import PageHeader from "../components/PageHeader";
import Dashboard from "../components/Dashboard";
import NextPageArrow from "../components/NextPageArrow";

export default function DashboardPage() {
  return (
    <>
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
      <NextPageArrow to="/methodology" label="Methodology" />
    </>
  );
}
