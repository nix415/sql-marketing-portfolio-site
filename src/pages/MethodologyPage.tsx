import type { CSSProperties } from "react";
import PageHeader from "../components/PageHeader";
import Methodology from "../components/Methodology";
import NextPageArrow from "../components/NextPageArrow";

export default function MethodologyPage() {
  return (
    <>
      <PageHeader
        eyebrow="How the dataset maps"
        title="Column mapping approach."
        description="This dataset has no event stream, no attribution columns, and no signup timestamps. These mappings turn the fields it does have into the marketing analytics it doesn't — so the five analyses stay faithful to how a growth team actually works."
      />
      <div
        className="mx-auto max-w-6xl px-6 pb-24 hero-rise"
        style={{ "--hero-delay": "320ms" } as CSSProperties}
      >
        <Methodology />
      </div>
      <NextPageArrow to="/about" label="About" />
    </>
  );
}
