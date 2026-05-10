import { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SITE } from "../data/site";
import { useActiveSection } from "../hooks/useActiveSection";

const SECTION_IDS: Record<string, string> = {
  Overview: "overview",
  Analyses: "analyses",
  Dashboard: "dashboard",
  Methodology: "methodology",
  About: "about",
};

const SECTION_ORDER = [
  "overview",
  "analyses",
  "dashboard",
  "methodology",
  "about",
];

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onLanding = pathname === "/";
  const activeSection = useActiveSection(onLanding ? SECTION_ORDER : []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      // If we're on landing, scroll smoothly. Otherwise let router push to /#id.
      if (onLanding) {
        e.preventDefault();
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", `#${sectionId}`);
        }
      } else {
        e.preventDefault();
        navigate(`/#${sectionId}`);
      }
    },
    [onLanding, navigate],
  );

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-[color:var(--color-bg)]/80">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="press flex items-baseline gap-2 group"
          aria-label="Home"
          onClick={(e) => {
            if (onLanding) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              history.replaceState(null, "", "/");
            }
          }}
        >
          <span className="display text-lg tracking-tight">{SITE.name}</span>
          <span className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-muted)] group-hover:text-[color:var(--color-accent)] transition-colors">
            / marketing analytics · SQL
          </span>
        </Link>

        <nav className="flex items-center gap-4 md:gap-6 text-sm overflow-x-auto">
          {SITE.nav.map((item) => {
            const sectionId = SECTION_IDS[item] ?? "overview";
            const isActive = onLanding && activeSection === sectionId;
            return (
              <a
                key={item}
                href={`/#${sectionId}`}
                onClick={(e) => handleNavClick(e, sectionId)}
                className={`relative press whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-[color:var(--color-ink)] font-medium"
                    : "text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]"
                }`}
              >
                {item}
                <span
                  className={`absolute -bottom-1.5 left-0 right-0 mx-auto h-[2px] bg-[color:var(--color-accent)] rounded-full transition-all duration-300 ${
                    isActive ? "w-4 opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
