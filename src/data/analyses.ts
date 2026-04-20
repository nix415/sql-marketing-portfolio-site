/**
 * All five SQL analyses, exactly as they appear in the .sql files at
 * /public/queries, plus the marketing context a recruiter wants to see:
 * the business question, the approach, the techniques used, and an
 * illustrative result snippet for each query.
 *
 * Sample result rows are illustrative — based on the shape the query
 * returns, not on a live run of the dataset.
 */

export type ResultTable = {
  columns: string[];
  rows: (string | number)[][];
  /** Indices of numeric columns (right-aligned, tabular numerals). */
  numCols?: number[];
};

export type Query = {
  label: string;
  description: string;
  sql: string;
  result?: ResultTable;
};

export type Analysis = {
  slug: string;
  number: string;
  title: string;
  oneLiner: string;
  businessQuestion: string;
  approach: string;
  techniques: string[];
  queries: Query[];
  takeaway: string;
  /** A short list of 2-3 KPI-style numbers to show on the deep-dive page. */
  highlights: { label: string; value: string }[];
};

export const ANALYSES: Analysis[] = [
  // ────────────────────────────────────────────────────────────
  // 01 · Traffic & Acquisition
  // ────────────────────────────────────────────────────────────
  {
    slug: "traffic-acquisition",
    number: "01",
    title: "Traffic & Acquisition",
    oneLiner:
      "Where customers come from, sliced by category, age, and gender — the analyst version of a top-of-funnel channel report.",
    businessQuestion:
      "Which acquisition channels (product categories) are pulling in the most customers, and which demographics over-index in each one?",
    approach:
      "Treats preferred_category as the acquisition channel and age_group as the source segment. Three queries: total channel mix, channel × age_group breakdown, and channel × gender split — the same shape a paid-media report takes.",
    techniques: ["CTE", "CROSS JOIN", "CASE binning", "GROUP BY rollup"],
    highlights: [
      { value: "5", label: "channels compared" },
      { value: "5", label: "age segments" },
      { value: "3", label: "queries" },
    ],
    queries: [
      {
        label: "1A · Channel mix",
        description:
          "Customer distribution by preferred category — analogous to 'which channels drive the most traffic.'",
        sql: `WITH category_counts AS (
    SELECT
        preferred_category,
        COUNT(*)                            AS customer_count,
        ROUND(AVG(income), 2)               AS avg_income,
        ROUND(AVG(spending_score), 2)       AS avg_spending_score,
        ROUND(AVG(last_purchase_amount), 2) AS avg_last_purchase
    FROM customers
    GROUP BY preferred_category
),
total AS (
    SELECT SUM(customer_count) AS total_customers
    FROM category_counts
)
SELECT
    cc.preferred_category   AS channel,
    cc.customer_count,
    ROUND(cc.customer_count * 100.0 / t.total_customers, 1) AS pct_of_total,
    cc.avg_income,
    cc.avg_spending_score,
    cc.avg_last_purchase
FROM category_counts cc
CROSS JOIN total t
ORDER BY cc.customer_count DESC;`,
        result: {
          columns: [
            "channel",
            "customers",
            "pct",
            "avg_income",
            "avg_score",
            "avg_purchase",
          ],
          numCols: [1, 2, 3, 4, 5],
          rows: [
            ["Electronics", 234, "23.4", 71250.0, 56.1, 78.4],
            ["Clothing", 218, "21.8", 68940.0, 54.8, 72.6],
            ["Groceries", 196, "19.6", 65120.0, 49.3, 41.2],
            ["Home Goods", 182, "18.2", 70010.0, 52.7, 84.1],
            ["Sports", 170, "17.0", 67830.0, 58.2, 76.9],
          ],
        },
      },
      {
        label: "1B · Channel × age segment",
        description:
          "Acquisition breakdown by age group within each channel — like segmenting traffic sources by audience.",
        sql: `WITH age_segments AS (
    SELECT
        *,
        CASE
            WHEN age < 25            THEN '18-24'
            WHEN age BETWEEN 25 AND 34 THEN '25-34'
            WHEN age BETWEEN 35 AND 44 THEN '35-44'
            WHEN age BETWEEN 45 AND 54 THEN '45-54'
            ELSE '55+'
        END AS age_group
    FROM customers
),
segment_summary AS (
    SELECT
        preferred_category,
        age_group,
        COUNT(*)                          AS customer_count,
        ROUND(AVG(income), 2)             AS avg_income,
        ROUND(AVG(purchase_frequency), 1) AS avg_purchase_freq
    FROM age_segments
    GROUP BY preferred_category, age_group
),
category_totals AS (
    SELECT preferred_category, SUM(customer_count) AS cat_total
    FROM segment_summary
    GROUP BY preferred_category
)
SELECT
    ss.preferred_category AS channel,
    ss.age_group          AS source_segment,
    ss.customer_count,
    ROUND(ss.customer_count * 100.0 / ct.cat_total, 1) AS pct_within_channel,
    ss.avg_income,
    ss.avg_purchase_freq
FROM segment_summary ss
JOIN category_totals ct
  ON ss.preferred_category = ct.preferred_category
ORDER BY ss.preferred_category, ss.customer_count DESC;`,
      },
      {
        label: "1C · Channel × gender split",
        description: "Quick gender-split lens on each channel.",
        sql: `SELECT
    preferred_category   AS channel,
    gender,
    COUNT(*)             AS customer_count,
    ROUND(AVG(spending_score), 1)     AS avg_spending_score,
    ROUND(AVG(last_purchase_amount), 2) AS avg_last_purchase
FROM customers
GROUP BY preferred_category, gender
ORDER BY preferred_category, customer_count DESC;`,
      },
    ],
    takeaway:
      "Shift paid acquisition budget toward the categories with the highest average spending score and purchase amount, then tailor ad creative to the dominant age and gender segment within each channel.",
  },

  // ────────────────────────────────────────────────────────────
  // 02 · Funnel Conversion
  // ────────────────────────────────────────────────────────────
  {
    slug: "funnel-conversion",
    number: "02",
    title: "Funnel Conversion",
    oneLiner:
      "A behavioral funnel — All Users → Engaged → Active Buyers → High-Value — to find the leakiest stage.",
    businessQuestion:
      "At which stage of the funnel do we lose the most customers, and which categories convert the best at every stage?",
    approach:
      "Models a marketing funnel using behavioral thresholds: spending_score ≥ 40 (Engaged), purchase_frequency ≥ 15 (Active Buyer), last_purchase_amount ≥ 75 (High-Value). Then breaks the funnel down by category and gender to find conversion gaps.",
    techniques: [
      "Conditional aggregation",
      "CASE WHEN sums",
      "Drop-off math",
      "GROUP BY rollups",
    ],
    highlights: [
      { value: "4", label: "funnel stages" },
      { value: "3", label: "drop-off rates" },
      { value: "3", label: "queries" },
    ],
    queries: [
      {
        label: "2A · Overall funnel + drop-off",
        description:
          "Stage counts plus stage-to-stage conversion and drop-off percentages.",
        sql: `WITH funnel AS (
    SELECT
        COUNT(*) AS stage_1_all_users,

        SUM(CASE WHEN spending_score >= 40
                 THEN 1 ELSE 0 END) AS stage_2_engaged,

        SUM(CASE WHEN spending_score >= 40
                  AND purchase_frequency >= 15
                 THEN 1 ELSE 0 END) AS stage_3_active_buyers,

        SUM(CASE WHEN spending_score >= 40
                  AND purchase_frequency >= 15
                  AND last_purchase_amount >= 75
                 THEN 1 ELSE 0 END) AS stage_4_high_value
    FROM customers
)
SELECT
    stage_1_all_users,
    stage_2_engaged,
    ROUND(stage_2_engaged * 100.0 / stage_1_all_users, 1) AS pct_engaged,
    ROUND((stage_1_all_users - stage_2_engaged) * 100.0
        / stage_1_all_users, 1) AS drop_off_1_to_2,

    stage_3_active_buyers,
    ROUND(stage_3_active_buyers * 100.0 / stage_2_engaged, 1) AS pct_engaged_to_active,
    ROUND((stage_2_engaged - stage_3_active_buyers) * 100.0
        / stage_2_engaged, 1) AS drop_off_2_to_3,

    stage_4_high_value,
    ROUND(stage_4_high_value * 100.0 / stage_3_active_buyers, 1) AS pct_active_to_highval,
    ROUND((stage_3_active_buyers - stage_4_high_value) * 100.0
        / stage_3_active_buyers, 1) AS drop_off_3_to_4
FROM funnel;`,
        result: {
          columns: ["stage", "customers", "conversion %", "drop-off %"],
          numCols: [1, 2, 3],
          rows: [
            ["1 · All Users", 1000, "100.0", "—"],
            ["2 · Engaged", 612, "61.2", "38.8"],
            ["3 · Active Buyers", 318, "52.0", "48.0"],
            ["4 · High-Value", 184, "57.9", "42.1"],
          ],
        },
      },
      {
        label: "2B · Funnel by channel",
        description:
          "Which categories convert best at every stage — useful for shifting budget to high-conversion channels.",
        sql: `WITH category_funnel AS (
    SELECT
        preferred_category,
        COUNT(*) AS total,
        SUM(CASE WHEN spending_score >= 40 THEN 1 ELSE 0 END) AS engaged,
        SUM(CASE WHEN spending_score >= 40
                  AND purchase_frequency >= 15 THEN 1 ELSE 0 END) AS active_buyers,
        SUM(CASE WHEN spending_score >= 40
                  AND purchase_frequency >= 15
                  AND last_purchase_amount >= 75 THEN 1 ELSE 0 END) AS high_value
    FROM customers
    GROUP BY preferred_category
)
SELECT
    preferred_category,
    total,
    engaged,
    ROUND(engaged * 100.0 / total, 1)            AS engaged_rate,
    active_buyers,
    ROUND(active_buyers * 100.0 / engaged, 1)    AS active_rate,
    high_value,
    ROUND(high_value * 100.0 / active_buyers, 1) AS high_value_rate
FROM category_funnel
ORDER BY high_value_rate DESC;`,
      },
      {
        label: "2C · Funnel by gender",
        description: "Identify demographic conversion gaps end-to-end.",
        sql: `WITH gender_funnel AS (
    SELECT
        gender,
        COUNT(*) AS total,
        SUM(CASE WHEN spending_score >= 40 THEN 1 ELSE 0 END) AS engaged,
        SUM(CASE WHEN spending_score >= 40
                  AND purchase_frequency >= 15 THEN 1 ELSE 0 END) AS active_buyers,
        SUM(CASE WHEN spending_score >= 40
                  AND purchase_frequency >= 15
                  AND last_purchase_amount >= 75 THEN 1 ELSE 0 END) AS high_value
    FROM customers
    GROUP BY gender
)
SELECT
    gender,
    total,
    ROUND(engaged * 100.0 / total, 1)            AS engaged_rate,
    ROUND(active_buyers * 100.0 / engaged, 1)    AS active_to_buyer_rate,
    ROUND(high_value * 100.0 / active_buyers, 1) AS buyer_to_highval_rate
FROM gender_funnel
ORDER BY buyer_to_highval_rate DESC;`,
      },
    ],
    takeaway:
      "The biggest leak sits between 'Engaged' and 'Active Buyer' — the people who care but haven't converted. That's where retargeting and nurture spend should go. Categories with high high-value-rate deserve more top-of-funnel investment because they yield the best downstream ROI.",
  },

  // ────────────────────────────────────────────────────────────
  // 03 · Cohort Retention
  // ────────────────────────────────────────────────────────────
  {
    slug: "cohort-retention",
    number: "03",
    title: "Cohort Retention",
    oneLiner:
      "Membership-tenure cohorts as a stand-in for signup cohorts — classic retention table behavior.",
    businessQuestion:
      "Are newer cohorts as engaged as long-tenured ones, and do category preferences shift as customers stay longer?",
    approach:
      "Groups customers by membership_years (cohort proxy) and computes engagement, retention rate, and category mix per cohort. Mirrors the shape of a month-N retention grid.",
    techniques: [
      "GROUP BY cohorts",
      "Retention rate calc",
      "Cross-tab via JOIN",
      "MIN / AVG / MAX rollups",
    ],
    highlights: [
      { value: "4", label: "queries" },
      { value: ">=20", label: "freq for 'retained'" },
      { value: "%", label: "retention by cohort" },
    ],
    queries: [
      {
        label: "3A · Cohort summary",
        description:
          "Per-cohort engagement, spending, purchase frequency and income.",
        sql: `WITH cohort_metrics AS (
    SELECT
        membership_years              AS cohort_year,
        COUNT(*)                      AS cohort_size,
        ROUND(AVG(purchase_frequency), 1)   AS avg_purchase_freq,
        ROUND(AVG(spending_score), 1)       AS avg_spending_score,
        ROUND(AVG(last_purchase_amount), 2) AS avg_last_purchase,
        ROUND(AVG(income), 2)               AS avg_income
    FROM customers
    GROUP BY membership_years
)
SELECT
    cohort_year, cohort_size, avg_purchase_freq,
    avg_spending_score, avg_last_purchase, avg_income
FROM cohort_metrics
ORDER BY cohort_year;`,
      },
      {
        label: "3B · Retention rate by cohort",
        description:
          "Defines 'retained' as purchase_frequency ≥ 20 — top-tier buyers who are still active.",
        sql: `WITH retention AS (
    SELECT
        membership_years AS cohort_year,
        COUNT(*)         AS cohort_size,
        SUM(CASE WHEN purchase_frequency >= 20
                 THEN 1 ELSE 0 END) AS retained_customers
    FROM customers
    GROUP BY membership_years
)
SELECT
    cohort_year, cohort_size, retained_customers,
    ROUND(retained_customers * 100.0 / cohort_size, 1) AS retention_rate_pct
FROM retention
ORDER BY cohort_year;`,
        result: {
          columns: ["cohort_year", "cohort_size", "retained", "retention %"],
          numCols: [0, 1, 2, 3],
          rows: [
            [0, 142, 47, "33.1"],
            [1, 138, 51, "37.0"],
            [2, 156, 64, "41.0"],
            [3, 161, 71, "44.1"],
            [4, 145, 56, "38.6"],
            [5, 128, 39, "30.5"],
            [6, 130, 32, "24.6"],
          ],
        },
      },
      {
        label: "3C · Cohort × category cross-tab",
        description:
          "Whether long-tenured customers gravitate to different products than newer signups.",
        sql: `WITH cohort_category AS (
    SELECT
        membership_years              AS cohort_year,
        preferred_category,
        COUNT(*)                      AS customer_count,
        ROUND(AVG(last_purchase_amount), 2) AS avg_order_value
    FROM customers
    GROUP BY membership_years, preferred_category
),
cohort_totals AS (
    SELECT cohort_year, SUM(customer_count) AS cohort_total
    FROM cohort_category
    GROUP BY cohort_year
)
SELECT
    cc.cohort_year,
    cc.preferred_category,
    cc.customer_count,
    ROUND(cc.customer_count * 100.0 / ct.cohort_total, 1) AS pct_of_cohort,
    cc.avg_order_value
FROM cohort_category cc
JOIN cohort_totals ct ON cc.cohort_year = ct.cohort_year
ORDER BY cc.cohort_year, cc.customer_count DESC;`,
      },
      {
        label: "3D · Spending range by tenure",
        description:
          "Min / avg / max spending score per cohort — are long-tenured customers more engaged or burning out?",
        sql: `SELECT
    membership_years              AS cohort_year,
    MIN(spending_score)           AS min_score,
    ROUND(AVG(spending_score), 1) AS avg_score,
    MAX(spending_score)           AS max_score,
    COUNT(*)                      AS n
FROM customers
GROUP BY membership_years
ORDER BY membership_years;`,
      },
    ],
    takeaway:
      "If retention drops in older cohorts, fund win-back campaigns for high-tenure / low-frequency customers. If newer cohorts show lower spending scores, the onboarding and early-lifecycle email flow is where to invest.",
  },

  // ────────────────────────────────────────────────────────────
  // 04 · Revenue & Campaign ROI
  // ────────────────────────────────────────────────────────────
  {
    slug: "revenue-roi",
    number: "04",
    title: "Revenue & Campaign ROI",
    oneLiner:
      "Where revenue actually concentrates, by channel, income tier, and demographic — the budget-allocation lens.",
    businessQuestion:
      "Which channels and segments produce the most revenue per customer, and where should we put the next dollar of budget?",
    approach:
      "Splits revenue by category (channel proxy), income quartile (NTILE-based campaign tier), and category × gender. Includes a per-membership-year revenue efficiency view to hint at LTV trajectory.",
    techniques: [
      "CTE + CROSS JOIN for % of total",
      "NTILE(4) quartiles",
      "CASE labels",
      "AOV / revenue-per-transaction math",
    ],
    highlights: [
      { value: "4", label: "queries" },
      { value: "Q1–Q4", label: "income tiers" },
      { value: "Top 10", label: "channel × gender combos" },
    ],
    queries: [
      {
        label: "4A · Revenue by channel",
        description:
          "Total revenue, AOV, customers, and % of overall revenue per channel.",
        sql: `WITH channel_revenue AS (
    SELECT
        preferred_category                  AS channel,
        COUNT(*)                            AS customers,
        SUM(last_purchase_amount)           AS total_revenue,
        ROUND(AVG(last_purchase_amount), 2) AS avg_order_value,
        ROUND(SUM(last_purchase_amount) * 1.0 /
              SUM(purchase_frequency), 2)   AS revenue_per_transaction,
        SUM(purchase_frequency)             AS total_transactions
    FROM customers
    GROUP BY preferred_category
),
grand_total AS (
    SELECT SUM(total_revenue) AS overall_revenue FROM channel_revenue
)
SELECT
    cr.channel,
    cr.customers,
    cr.total_revenue,
    ROUND(cr.total_revenue * 100.0 / gt.overall_revenue, 1) AS pct_of_revenue,
    cr.avg_order_value,
    cr.revenue_per_transaction,
    cr.total_transactions
FROM channel_revenue cr
CROSS JOIN grand_total gt
ORDER BY cr.total_revenue DESC;`,
        result: {
          columns: ["channel", "customers", "total_rev", "% rev", "AOV"],
          numCols: [1, 2, 3, 4],
          rows: [
            ["Electronics", 234, "18,358.20", "24.6", "78.45"],
            ["Home Goods", 182, "15,306.20", "20.5", "84.10"],
            ["Sports", 170, "13,073.00", "17.5", "76.90"],
            ["Clothing", 218, "15,826.80", "21.2", "72.60"],
            ["Groceries", 196, "8,075.20", "10.8", "41.20"],
          ],
        },
      },
      {
        label: "4B · Revenue by income tier (NTILE quartiles)",
        description:
          "Income-quartile revenue — simulates a campaign-tier ROI report.",
        sql: `WITH income_tiers AS (
    SELECT *, NTILE(4) OVER (ORDER BY income) AS income_quartile
    FROM customers
)
SELECT
    CASE income_quartile
        WHEN 1 THEN 'Q1 - Low Income'
        WHEN 2 THEN 'Q2 - Mid-Low'
        WHEN 3 THEN 'Q3 - Mid-High'
        WHEN 4 THEN 'Q4 - High Income'
    END                                   AS income_tier,
    COUNT(*)                              AS customers,
    ROUND(AVG(last_purchase_amount), 2)   AS avg_order_value,
    SUM(last_purchase_amount)             AS total_revenue,
    ROUND(AVG(purchase_frequency), 1)     AS avg_purchase_freq,
    ROUND(AVG(spending_score), 1)         AS avg_spending_score
FROM income_tiers
GROUP BY income_quartile
ORDER BY income_quartile;`,
      },
      {
        label: "4C · Top channel × gender combos",
        description:
          "Top 10 demographic × channel pairs by revenue — exactly where to double down.",
        sql: `SELECT
    preferred_category   AS channel,
    gender,
    COUNT(*)             AS customers,
    SUM(last_purchase_amount)           AS total_revenue,
    ROUND(AVG(last_purchase_amount), 2) AS avg_order_value,
    ROUND(AVG(purchase_frequency), 1)   AS avg_freq
FROM customers
GROUP BY preferred_category, gender
ORDER BY total_revenue DESC
LIMIT 10;`,
      },
      {
        label: "4D · Revenue per membership year",
        description: "LTV proxy — revenue efficiency by tenure.",
        sql: `SELECT
    membership_years,
    COUNT(*)                              AS customers,
    SUM(last_purchase_amount)             AS total_revenue,
    ROUND(AVG(last_purchase_amount), 2)   AS avg_order_value,
    ROUND(SUM(last_purchase_amount) * 1.0 / COUNT(*), 2) AS revenue_per_customer,
    ROUND(AVG(purchase_frequency), 1)     AS avg_purchase_freq
FROM customers
GROUP BY membership_years
ORDER BY membership_years;`,
      },
    ],
    takeaway:
      "High-volume / low-AOV channels are scale plays — push them with broad-reach campaigns. High-AOV / low-volume channels are premium segments worth personalised ads. The income-tier breakdown answers whether the next dollar should chase volume (lower tiers) or margin (upper tiers).",
  },

  // ────────────────────────────────────────────────────────────
  // 05 · RFM Segmentation
  // ────────────────────────────────────────────────────────────
  {
    slug: "rfm-segmentation",
    number: "05",
    title: "RFM Segmentation",
    oneLiner:
      "High / Mid / Low value tiers via Recency, Frequency, Monetary scoring — actionable segments for lifecycle campaigns.",
    businessQuestion:
      "Who are our most valuable customers, and which segments deserve VIP treatment vs. reactivation vs. suppression?",
    approach:
      "Maps membership_years → Recency (inverted), purchase_frequency → Frequency, last_purchase_amount → Monetary. Splits each dimension into thirds with NTILE(3), sums into a composite score, and assigns a value tier. Includes a segment × category heatmap query for targeting.",
    techniques: [
      "NTILE(3) window functions",
      "Composite scoring",
      "CASE-based segmentation",
      "Heatmap cross-tab",
    ],
    highlights: [
      { value: "3", label: "value tiers" },
      { value: "5", label: "queries" },
      { value: "1,000", label: "customers scored" },
    ],
    queries: [
      {
        label: "5A · Score every customer (R, F, M)",
        description:
          "Assign each customer an R, F, and M score from 1–3 using NTILE(3).",
        sql: `WITH rfm_scores AS (
    SELECT
        id, age, gender, income,
        membership_years, purchase_frequency,
        last_purchase_amount, preferred_category, spending_score,

        -- Recency: lower membership_years = more recent → higher score
        NTILE(3) OVER (ORDER BY membership_years DESC)    AS r_score,

        -- Frequency: higher purchase_frequency → higher score
        NTILE(3) OVER (ORDER BY purchase_frequency ASC)   AS f_score,

        -- Monetary: higher last_purchase_amount → higher score
        NTILE(3) OVER (ORDER BY last_purchase_amount ASC) AS m_score
    FROM customers
)
SELECT * FROM rfm_scores;`,
      },
      {
        label: "5B · Composite score → value tier",
        description:
          "Sum R + F + M (max 9), then label as High / Mid / Low Value.",
        sql: `WITH rfm_segments AS (
    SELECT *,
        (r_score + f_score + m_score) AS rfm_total,
        CASE
            WHEN (r_score + f_score + m_score) >= 7 THEN 'High Value'
            WHEN (r_score + f_score + m_score) >= 5 THEN 'Mid Value'
            ELSE 'Low Value'
        END AS rfm_segment
    FROM rfm_scores
)
SELECT * FROM rfm_segments;`,
      },
      {
        label: "5C · Segment-level KPIs",
        description: "Summary table the marketing team can actually act on.",
        sql: `SELECT
    rfm_segment,
    COUNT(*)                              AS customer_count,
    ROUND(AVG(income), 2)                 AS avg_income,
    ROUND(AVG(spending_score), 1)         AS avg_spending_score,
    ROUND(AVG(purchase_frequency), 1)     AS avg_purchase_freq,
    ROUND(AVG(last_purchase_amount), 2)   AS avg_last_purchase,
    ROUND(AVG(membership_years), 1)       AS avg_membership_years
FROM rfm_segments
GROUP BY rfm_segment
ORDER BY
    CASE rfm_segment
        WHEN 'High Value' THEN 1
        WHEN 'Mid Value'  THEN 2
        ELSE 3
    END;`,
        result: {
          columns: [
            "segment",
            "customers",
            "avg_income",
            "avg_score",
            "avg_freq",
            "avg_purchase",
          ],
          numCols: [1, 2, 3, 4, 5],
          rows: [
            ["High Value", 218, 78420.5, 64.2, 22.1, 92.4],
            ["Mid Value", 511, 67910.2, 52.4, 14.6, 65.3],
            ["Low Value", 271, 60540.8, 41.7, 7.3, 38.1],
          ],
        },
      },
      {
        label: "5D · Customer-level export",
        description:
          "Every customer with R, F, M scores and final segment — drop into a CSV for campaign tooling.",
        sql: `WITH rfm_scores AS (
    SELECT
        id, age, gender, income,
        membership_years, purchase_frequency,
        last_purchase_amount, preferred_category, spending_score,
        NTILE(3) OVER (ORDER BY membership_years DESC)    AS r_score,
        NTILE(3) OVER (ORDER BY purchase_frequency ASC)   AS f_score,
        NTILE(3) OVER (ORDER BY last_purchase_amount ASC) AS m_score
    FROM customers
)
SELECT
    id, age, gender, preferred_category, income,
    r_score, f_score, m_score,
    (r_score + f_score + m_score) AS rfm_total,
    CASE
        WHEN (r_score + f_score + m_score) >= 7 THEN 'High Value'
        WHEN (r_score + f_score + m_score) >= 5 THEN 'Mid Value'
        ELSE 'Low Value'
    END AS rfm_segment
FROM rfm_scores
ORDER BY rfm_total DESC, last_purchase_amount DESC;`,
      },
      {
        label: "5E · Segment × category heatmap",
        description:
          "Which categories dominate in each value tier — useful for targeted campaigns.",
        sql: `WITH rfm_segments AS (
    SELECT *,
        CASE
            WHEN (r_score + f_score + m_score) >= 7 THEN 'High Value'
            WHEN (r_score + f_score + m_score) >= 5 THEN 'Mid Value'
            ELSE 'Low Value'
        END AS rfm_segment
    FROM rfm_scores
)
SELECT
    rfm_segment, preferred_category,
    COUNT(*)                            AS customer_count,
    ROUND(AVG(last_purchase_amount), 2) AS avg_order_value,
    ROUND(AVG(purchase_frequency), 1)   AS avg_freq
FROM rfm_segments
GROUP BY rfm_segment, preferred_category
ORDER BY
    CASE rfm_segment
        WHEN 'High Value' THEN 1
        WHEN 'Mid Value'  THEN 2
        ELSE 3
    END,
    customer_count DESC;`,
      },
    ],
    takeaway:
      "High-Value gets VIP treatment (early access, loyalty rewards, upsell). Mid-Value is the biggest growth lever — targeted promos move them to High. Low-Value gets a reactivation sequence; if they don't respond, suppress from paid campaigns to protect ROAS.",
  },
];

export function getAnalysisBySlug(slug: string): Analysis | undefined {
  return ANALYSES.find((a) => a.slug === slug);
}
