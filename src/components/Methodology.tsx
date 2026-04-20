const MAPPINGS = [
  {
    label: "Acquisition channel",
    db: "preferred_category",
    note: "Each product category is treated as the channel that 'acquired' the customer.",
  },
  {
    label: "Cohort / Recency",
    db: "membership_years",
    note: "Tenure is the cohort dimension and the inverse-Recency signal in RFM.",
  },
  {
    label: "Funnel stage",
    db: "spending_score · purchase_frequency · last_purchase_amount",
    note: "Behavioral thresholds model awareness → engaged → buyer → high-value.",
  },
  {
    label: "Campaign tier",
    db: "income (NTILE quartile)",
    note: "Income quartiles simulate campaign-tier targeting.",
  },
];

export default function Methodology() {
  return (
    <div className="space-y-5">
      <p className="text-base text-[color:var(--color-muted)] max-w-prose">
        The dataset has no event-stream, attribution columns, or signup
        timestamps. To still apply real marketing-analytics frameworks,
        each query maps existing fields to their marketing equivalents:
      </p>
      <ul className="divide-y divide-[color:var(--color-line)] border-y border-[color:var(--color-line)]">
        {MAPPINGS.map((m) => (
          <li
            key={m.label}
            className="grid md:grid-cols-12 gap-4 py-5 md:py-6"
          >
            <div className="md:col-span-3">
              <div className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-1">
                Maps to
              </div>
              <div className="display text-base">{m.label}</div>
            </div>
            <div className="md:col-span-9">
              <div className="mono text-sm text-[color:var(--color-accent)] mb-1">
                {m.db}
              </div>
              <div className="text-sm text-[color:var(--color-muted)]">
                {m.note}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
