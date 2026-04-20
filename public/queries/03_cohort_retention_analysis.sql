-- ============================================================
-- 03 | COHORT RETENTION ANALYSIS
-- ============================================================
-- Goal: Group customers by their membership tenure (as a proxy
-- for signup cohort) and analyze how engagement, spending, and
-- purchase behavior differ across cohorts. This mirrors classic
-- month-over-month retention tables built from event timestamps.
-- ============================================================

-- 3A: Membership-year cohort summary
-- Treats each membership_years value as a cohort (year 0 = newest).

WITH cohort_metrics AS (
    SELECT
        membership_years              AS cohort_year,
        COUNT(*)                      AS cohort_size,
        ROUND(AVG(purchase_frequency), 1) AS avg_purchase_freq,
        ROUND(AVG(spending_score), 1)     AS avg_spending_score,
        ROUND(AVG(last_purchase_amount), 2) AS avg_last_purchase,
        ROUND(AVG(income), 2)             AS avg_income
    FROM customers
    GROUP BY membership_years
)
SELECT
    cohort_year,
    cohort_size,
    avg_purchase_freq,
    avg_spending_score,
    avg_last_purchase,
    avg_income
FROM cohort_metrics
ORDER BY cohort_year;

-- -----------------------------------------------------------------

-- 3B: Retention proxy — % of each cohort that remains "active"
-- We define "retained" as purchase_frequency >= 20 (top-tier buyers).
-- This mimics month-N retention rates in a cohort retention grid.

WITH retention AS (
    SELECT
        membership_years             AS cohort_year,
        COUNT(*)                     AS cohort_size,
        SUM(CASE WHEN purchase_frequency >= 20
                 THEN 1 ELSE 0 END) AS retained_customers
    FROM customers
    GROUP BY membership_years
)
SELECT
    cohort_year,
    cohort_size,
    retained_customers,
    ROUND(retained_customers * 100.0 / cohort_size, 1)
        AS retention_rate_pct
FROM retention
ORDER BY cohort_year;

-- -----------------------------------------------------------------

-- 3C: Cohort × category cross-tab
-- Shows how category preferences shift across membership cohorts,
-- revealing whether long-tenured customers gravitate to different
-- product lines than newer signups.

WITH cohort_category AS (
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
    ROUND(cc.customer_count * 100.0 / ct.cohort_total, 1)
        AS pct_of_cohort,
    cc.avg_order_value
FROM cohort_category cc
JOIN cohort_totals ct ON cc.cohort_year = ct.cohort_year
ORDER BY cc.cohort_year, cc.customer_count DESC;

-- -----------------------------------------------------------------

-- 3D: Spending score trend by tenure
-- Are long-tenured customers more engaged or burning out?

SELECT
    membership_years              AS cohort_year,
    MIN(spending_score)           AS min_score,
    ROUND(AVG(spending_score), 1) AS avg_score,
    MAX(spending_score)           AS max_score,
    COUNT(*)                      AS n
FROM customers
GROUP BY membership_years
ORDER BY membership_years;

-- =================================================================
-- BUSINESS INSIGHT
-- =================================================================
-- If retention rates decline in older cohorts, the team should
-- launch win-back campaigns (email sequences, loyalty discounts)
-- targeting customers with high tenure but low recent purchase
-- frequency. If newer cohorts show lower spending scores, onboarding
-- flows and early lifecycle email sequences may need improvement
-- to drive engagement before customers churn.
-- =================================================================
