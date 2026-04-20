import { Link, useLocation } from "react-router-dom";
import { SITE } from "../data/site";

const NAV_ROUTES: Record<string, string> = {
  Overview: "/",
  Analyses: "/analyses",
  Dashboard: "/dashboard",
  Methodology: "/methodology",
  About: "/about",
};

function isRouteActive(currentPath: string, targetPath: string): boolean {
  if (targetPath === "/") return currentPath === "/";
  return currentPath === targetPath || currentPath.startsWith(targetPath + "/");
}

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-[color:var(--color-bg)]/80">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="press flex items-baseline gap-2 group"
          aria-label="Home"
        >
          <span className="display text-lg tracking-tight">{SITE.name}</span>
          <span className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-muted)] group-hover:text-[color:var(--color-accent)] transition-colors">
            / SQL · marketing
          </span>
        </Link>

        <nav className="flex items-center gap-4 md:gap-6 text-sm overflow-x-auto">
          {SITE.nav.map((item) => {
            const to = NAV_ROUTES[item] ?? "/";
            const isActive = isRouteActive(pathname, to);
            return (
              <Link
                key={item}
                to={to}
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
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
