import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import AnalysesPage from "./pages/Analyses";
import AnalysisDetail from "./pages/AnalysisDetail";
import DashboardPage from "./pages/DashboardPage";
import MethodologyPage from "./pages/MethodologyPage";
import AboutPage from "./pages/AboutPage";
import { SITE } from "./data/site";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analyses" element={<AnalysesPage />} />
          <Route path="/analyses/:slug" element={<AnalysisDetail />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-xs text-[color:var(--color-muted)] flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[color:var(--color-line)] mt-10">
        <span>
          © {new Date().getFullYear()} {SITE.name}
        </span>
        <span className="mono">
          built with React · TypeScript · Tailwind · deployed on Vercel
        </span>
      </footer>
    </>
  );
}
