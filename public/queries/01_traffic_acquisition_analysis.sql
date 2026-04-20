-- ============================================================
-- 01 | TRAFFIC & ACQUISITION ANALYSIS
-- ============================================================
-- Goal: Understand where customers are coming from by analyzing
-- their demographic segments and preferred shopping categories.
-- We treat preferred_category as the "acquisition channel" and
-- age_group as the "source" to mirror real-world traffic reports.
-- ============================================================

-- 1A: Customer distribution by preferred category (channel proxy)
-- Shows which product categories attract the most customers,
-- analogous to "which channels drive the most traffic."

WITH category_counts AS (
    SELECT
        preferred_category,
        COUNT(*)                AS customer_count,
        ROUND(AVG(income), 2)   AS avg_income,
        ROUND(AVG(spending_score), 2) AS avg_spending_score,
        ROUND(AVG(last_purchase_amount), 2) AS avg_last_purchase
    FROM customers
    GROUP BY preferred_category
),
total AS (
    SELECT SUM(customer_count) AS total_customers
    FROM category_counts
)
SELECT
    cc.preferred_category           AS channel,
    cc.customer_count,
    ROUND(cc.customer_count * 100.0 / t.total_customers, 1)
                                     AS pct_of_total,
    cc.avg_income,
    cc.avg_spending_score,
    cc.avg_last_purchase
FROM category_counts cc
CROSS JOIN total t
ORDER BY cc.customer_count DESC;

-- -----------------------------------------------------------------

-- 1B: Acquisition breakdown by age group within each category
-- Reveals which age demographics each category attracts most,
-- similar to segmenting traffic sources by audience.

WITH age_segments AS (
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
        COUNT(*)               AS customer_count,
        ROUND(AVG(income), 2)  AS avg_income,
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
    ss.preferred_category           AS channel,
    ss.age_group                    AS source_segment,
    ss.customer_count,
    ROUND(ss.customer_count * 100.0 / ct.cat_total, 1)
                                     AS pct_within_channel,
    ss.avg_income,
    ss.avg_purchase_freq
FROM segment_summary ss
JOIN category_totals ct
  ON ss.preferred_category = ct.preferred_category
ORDER BY ss.preferred_category, ss.customer_count DESC;

-- -----------------------------------------------------------------

-- 1C: Gender split per category — quick acquisition lens

SELECT
    preferred_category              AS channel,
    gender,
    COUNT(*)                        AS customer_count,
    ROUND(AVG(spending_score), 1)   AS avg_spending_score,
    ROUND(AVG(last_purchase_amount), 2) AS avg_last_purchase
FROM customers
GROUP BY preferred_category, gender
ORDER BY preferred_category, customer_count DESC;

-- =================================================================
-- BUSINESS INSIGHT
-- =================================================================
-- These queries reveal which product categories (channels) attract
-- the highest-value customers and which demographics over-index in
-- each category. A marketing team should shift paid acquisition
-- budget toward the categories with the highest avg spending scores
-- and purchase amounts, then tailor ad creative to the dominant age
-- and gender segments within those categories.
-- =================================================================
