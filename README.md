# Marketing Analytics in SQL — Portfolio Site

A React + TypeScript portfolio showcasing five SQL analyses on a 1,000-row
customer marketing dataset:

1. Traffic & Acquisition
2. Funnel Conversion
3. Cohort Retention
4. Revenue & Campaign ROI
5. RFM Segmentation

Each analysis has its own deep-dive page with the business question, the
SQL queries, sample results, and a marketing takeaway.

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4**
- **React Router** for deep-dive pages
- Custom zero-dependency SQL syntax highlighter
- Hosted on **Vercel**

## Where the SQL lives

The five raw SQL files are in [`public/queries/`](./public/queries) so they're
also browseable directly on GitHub. The same queries are mirrored in
[`src/data/analyses.ts`](./src/data/analyses.ts) where they're rendered into
the deep-dive pages.

## Local dev

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Build

```bash
npm run build
npm run preview
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Go to https://vercel.com → **Add New** → **Project** → import the repo.
3. Vercel auto-detects Vite. Default settings work.
4. (Optional) connect a custom domain.

The included `vercel.json` rewrites all non-`/queries/*` paths to
`index.html` so React Router deep-links work on refresh.

## Adding or editing analyses

Everything is data-driven. Open `src/data/analyses.ts`, edit or add a new
entry to the `ANALYSES` array, and the landing-page card + deep-dive page
update automatically.

## Author

Nixon Tse · [nixontse1@gmail.com](mailto:nixontse1@gmail.com) ·
[github.com/nix415](https://github.com/nix415) ·
[linkedin.com/in/nixontse](https://www.linkedin.com/in/nixontse/)
