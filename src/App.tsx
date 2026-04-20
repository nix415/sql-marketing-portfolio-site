import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import AnalysisDetail from "./pages/AnalysisDetail";
import { SITE } from "./data/site";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analyses/:slug" element={<AnalysisDetail />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-xs text-[color:var(--color-muted)] flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[color:var(--color-line)] mt-10">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <span className="mono">
          built with React · TypeScript · Tailwind · deployed on Vercel
        </span>
      </footer>
    </>
  );
}
