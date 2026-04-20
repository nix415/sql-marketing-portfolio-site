export const SITE = {
  name: "Nixon Tse",
  shortTitle: "SQL Marketing Analytics",
  tagline:
    "Five SQL analyses on a 1,000-customer dataset — the questions a growth or marketing analytics team asks every week.",
  nav: ["Overview", "Analyses", "Dashboard", "Methodology", "About"] as const,

  kpis: [
    { value: "1,000", label: "Customers" },
    { value: "5", label: "Analyses" },
    { value: "17", label: "SQL queries" },
    { value: "9", label: "Columns" },
  ],

  tableau: {
    enabled: false,
    embedUrl: "",
    publicUrl:
      "https://nix415.github.io/sql-marketing-portfolio/PASTE_YOUR_TABLEAU_PUBLIC_URL_HERE",
  },

  techStack: [
    "SQL",
    "SQLite",
    "DB Browser for SQLite",
    "CTEs",
    "Window functions",
    "Tableau Public",
    "React",
    "TypeScript",
  ],

  about: {
    body: "I'm Nixon — focused on growth marketing and marketing analytics. I built this portfolio to show recruiters how I'd approach the kind of questions a real growth or lifecycle team asks: where customers come from, where they fall out of the funnel, who's most worth keeping, and where revenue actually concentrates. Every query was written from scratch in SQLite and is documented like I'd document it on the job.",
    email: "nixontse1@gmail.com",
    github: "https://github.com/nix415",
    repo: "https://github.com/nix415/sql-marketing-portfolio-site",
    linkedin: "https://www.linkedin.com/in/nixontse/",
    portfolio: "https://nix415.vercel.app",
  },
} as const;
