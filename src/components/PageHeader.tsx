import type { CSSProperties, ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
};

export default function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <header className="mx-auto max-w-6xl px-6 pt-12 md:pt-16 pb-10 md:pb-14">
      {eyebrow && (
        <p
          className="text-xs tracking-[0.3em] uppercase text-[color:var(--color-muted)] mb-5 hero-rise"
          style={{ "--hero-delay": "0ms" } as CSSProperties}
        >
          {eyebrow}
        </p>
      )}
      <h1
        className="display text-4xl md:text-5xl leading-[1.05] max-w-3xl hero-rise"
        style={{ "--hero-delay": "120ms" } as CSSProperties}
      >
        {title}
      </h1>
      {description && (
        <p
          className="mt-6 text-base md:text-lg leading-relaxed text-[color:var(--color-muted)] max-w-2xl hero-rise"
          style={{ "--hero-delay": "220ms" } as CSSProperties}
        >
          {description}
        </p>
      )}
    </header>
  );
}
