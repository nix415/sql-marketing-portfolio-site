import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1.16-.02-2.1-3.2.69-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18a10.96 10.96 0 0 1 5.74 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.56C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
import { SITE } from "../data/site";
import HeroVisual from "./HeroVisual";

export default function Hero() {
  return (
    <section
      id="home"
      className="mx-auto max-w-6xl px-6 pt-12 md:pt-16 pb-20 scroll-mt-24"
    >
      <div className="md:grid md:grid-cols-12 md:items-center md:gap-8">
        <div
          className="
            order-1 md:order-none
            md:col-start-8 md:col-span-5 md:row-start-1
            relative hero-rise
          "
          style={{ "--hero-delay": "260ms" } as CSSProperties}
        >
          <HeroVisual />
        </div>

        <div
          className="
            order-2 md:order-none mt-10 md:mt-0
            md:col-start-1 md:col-span-7 md:row-start-1
            relative z-10
          "
        >
          <p
            className="text-xs tracking-[0.3em] uppercase text-[color:var(--color-muted)] mb-6 hero-rise"
            style={{ "--hero-delay": "0ms" } as CSSProperties}
          >
            Portfolio · {SITE.shortTitle}
          </p>
          <h1
            className="display text-4xl md:text-[3.25rem] leading-[1.05] hero-rise max-w-[36rem]"
            style={{ "--hero-delay": "120ms" } as CSSProperties}
          >
            Five SQL analyses that answer the questions a{" "}
            <span className="text-[color:var(--color-accent)]">
              growth team
            </span>{" "}
            asks every week.
          </h1>
          <p
            className="mt-6 text-base md:text-lg leading-relaxed text-[color:var(--color-muted)] max-w-[34rem] hero-rise"
            style={{ "--hero-delay": "200ms" } as CSSProperties}
          >
            Acquisition mix, funnel conversion, cohort retention, revenue
            ROI, and RFM segmentation — all written from scratch in SQLite,
            on a 1,000-customer marketing dataset.
          </p>
          <div
            className="mt-8 flex flex-wrap items-center gap-3 hero-rise"
            style={{ "--hero-delay": "320ms" } as CSSProperties}
          >
            <Link
              to="/analyses"
              className="press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-bg)] px-5 py-2.5 text-sm font-medium hover:bg-[color:var(--color-accent)] transition-colors"
            >
              View analyses
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={SITE.about.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex items-center gap-2 rounded-full border border-[color:var(--color-line)] px-5 py-2.5 text-sm text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)] transition-colors"
            >
              <GithubIcon className="h-4 w-4" />
              Source on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
