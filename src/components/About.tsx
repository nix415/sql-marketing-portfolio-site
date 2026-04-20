import type { CSSProperties } from "react";
import { SITE } from "../data/site";

export default function About() {
  const { body, email, github, linkedin, portfolio } = SITE.about;
  const links = [
    { label: "Email", value: email, href: `mailto:${email}` },
    { label: "GitHub", value: "github.com/nix415", href: github },
    { label: "LinkedIn", value: "linkedin.com/in/nixontse", href: linkedin },
    { label: "Main portfolio", value: "nix415.vercel.app", href: portfolio },
  ];

  return (
    <div className="space-y-8">
      <p className="text-base md:text-lg leading-relaxed text-[color:var(--color-ink)] max-w-2xl">
        {body}
      </p>

      <div className="pt-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted)] mb-4">
          Tech stack
        </p>
        <ul className="flex flex-wrap gap-2">
          {SITE.techStack.map((s, i) => (
            <li
              key={s}
              className="stagger-item mono text-[12px] px-3 py-1.5 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface)] text-[color:var(--color-ink)]"
              style={
                {
                  ["--stagger-delay" as never]: `${300 + i * 45}ms`,
                } as CSSProperties
              }
            >
              {s}
            </li>
          ))}
        </ul>
      </div>

      <ul className="flex flex-col">
        {links.map((l, i) => (
          <li
            key={l.label}
            className="stagger-item border-t border-[color:var(--color-line)] last:border-b"
            style={
              {
                ["--stagger-delay" as never]: `${500 + i * 80}ms`,
              } as CSSProperties
            }
          >
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={
                l.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="press flex items-center justify-between py-4 px-1 group"
            >
              <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--color-muted)]">
                {l.label}
              </span>
              <span className="display text-base group-hover:text-[color:var(--color-accent)] transition-colors">
                {l.value} →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
