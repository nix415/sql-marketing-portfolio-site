import Hero from "../components/Hero";
import KPIStrip from "../components/KPIStrip";
import NextPageArrow from "../components/NextPageArrow";

export default function Landing() {
  return (
    <>
      <Hero />
      <section id="overview" className="pb-24">
        <KPIStrip />
      </section>
      <NextPageArrow to="/analyses" label="Analyses" />
    </>
  );
}
