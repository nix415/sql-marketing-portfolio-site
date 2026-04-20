import type { CSSProperties, ReactNode } from "react";
import { useInView } from "../hooks/useInView";

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export default function Section({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: Props) {
  const [ref, inView] = useInView<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className={`mx-auto max-w-6xl px-6 py-20 scroll-mt-24 reveal ${
        inView ? "is-visible" : ""
      } ${className}`}
    >
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          {eyebrow && (
            <p
              className="text-xs tracking-[0.3em] uppercase text-[color:var(--color-muted)] mb-3 stagger-item"
              style={{ ["--stagger-delay" as never]: "0ms" } as CSSProperties}
            >
              {eyebrow}
            </p>
          )}
          <h2
            className="display text-3xl md:text-4xl stagger-item"
            style={{ ["--stagger-delay" as never]: "60ms" } as CSSProperties}
          >
            {title}
          </h2>
        </div>
        <div
          className="md:col-span-8 stagger-item"
          style={{ ["--stagger-delay" as never]: "180ms" } as CSSProperties}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
