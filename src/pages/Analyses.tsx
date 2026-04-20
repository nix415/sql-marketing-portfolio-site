import type { CSSProperties } from "react";
import PageHeader from "../components/PageHeader";
import AnalysisCard from "../components/AnalysisCard";
import NextPageArrow from "../components/NextPageArrow";
import { ANALYSES } from "../data/analyses";

export default function AnalysesPage() {
  return (
    <>
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
      <NextPageArrow to="/dashboard" label="Dashboard" />
    </>
  );
}
