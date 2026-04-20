import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type Props = {
  to: string;
  label: string;
};

/**
 * Floating "next page" navigator pinned to the right edge of the viewport.
 * Pill collapses to a round button and expands on hover to reveal the
 * destination page name. The arrow glyph gently nudges right on a loop.
 */
export default function NextPageArrow({ to, label }: Props) {
  return (
    <Link
      to={to}
      aria-label={`Next page: ${label}`}
      className="page-arrow group press fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-20"
    >
      <span className="flex items-center rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-bg)] shadow-lg overflow-hidden transition-all duration-300 group-hover:bg-[color:var(--color-accent)]">
        <span className="max-w-0 opacity-0 whitespace-nowrap pl-0 group-hover:max-w-[240px] group-hover:opacity-100 group-hover:pl-5 group-hover:pr-2 transition-all duration-300 flex flex-col items-start leading-tight py-2">
          <span className="text-[9px] uppercase tracking-[0.3em] opacity-70">
            Next
          </span>
          <span className="display text-sm">{label}</span>
        </span>
        <span className="flex items-center justify-center h-12 w-12 shrink-0">
          <ArrowRight className="h-5 w-5 page-arrow-nudge" />
        </span>
      </span>
    </Link>
  );
}
