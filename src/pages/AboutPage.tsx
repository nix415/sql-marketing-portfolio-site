import type { CSSProperties } from "react";
import PageHeader from "../components/PageHeader";
import About from "../components/About";

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="Who built this." />
      <div
        className="mx-auto max-w-6xl px-6 pb-24 hero-rise"
        style={{ "--hero-delay": "220ms" } as CSSProperties}
      >
        <About />
      </div>
    </>
  );
}
