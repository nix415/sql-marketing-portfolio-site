import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import AnalysisDetail from "./pages/AnalysisDetail";
import { SITE } from "./data/site";

function ScrollToHash() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        // Defer to next frame so layout is settled (esp. after route change).
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash, key]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analyses/:slug" element={<AnalysisDetail />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-xs text-[color:var(--color-muted)] border-t border-[color:var(--color-line)] mt-10">
        <span>
          © {new Date().getFullYear()} {SITE.name}
        </span>
      </footer>
    </>
  );
}
