import Hero from "../components/Hero";
import KPIStrip from "../components/KPIStrip";

export default function Landing() {
  return (
    <>
      <Hero />
      <section id="overview" className="pb-24">
        <KPIStrip />
      </section>
    </>
  );
}
