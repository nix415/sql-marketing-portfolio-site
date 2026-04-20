-- ============================================================
-- 02 | FUNNEL CONVERSION ANALYSIS
-- ============================================================
-- Goal: Model a marketing funnel using behavioral thresholds.
-- Since this dataset has no explicit event-level data, we
-- define funnel stages by engagement intensity:
--   Stage 1 (All Users)      → every customer in the database
--   Stage 2 (Engaged)        → spending_score >= 40
--   Stage 3 (Active Buyers)  → purchase_frequency >= 15
--   Stage 4 (High-Value)     → last_purchase_amount >= 75
-- This mirrors Visit → Interest → Purchase → High-AOV.
-- ============================================================

-- 2A: Overall funnel with stage counts and drop-off rates

WITH funnel AS (
    SELECT
        COUNT(*) AS stage_1_all_users,

        SUM(CASE WHEN spending_score >= 40
                 THEN 1 ELSE 0 END)
            AS stage_2_engaged,

        SUM(CASE WHEN spending_score >= 40
                  AND purchase_frequency >= 15
                 THEN 1 ELSE 0 END)
            AS stage_3_active_buyers,

        SUM(CASE WHEN spending_score >= 40
                  AND purchase_frequency >= 15
                  AND last_purchase_amount >= 75
                 THEN 1 ELSE 0 END)
            AS stage_4_high_value
    FROM customers
)
SELECT
    stage_1_all_users,
    stage_2_engaged,
    ROUND(stage_2_engaged * 100.0 / stage_1_all_users, 1)
        AS pct_engaged,
    ROUND((stage_1_all_users - stage_2_engaged) * 100.0 / stage_1_all_users, 1)
        AS drop_off_1_to_2,

    stage_3_active_buyers,
    ROUND(stage_3_active_buyers * 100.0 / stage_2_engaged, 1)
        AS pct_engaged_to_active,
    ROUND((stage_2_engaged - stage_3_active_buyers) * 100.0 / stage_2_engaged, 1)
        AS drop_off_2_to_3,

    stage_4_high_value,
    ROUND(stage_4_high_value * 100.0 / stage_3_active_buyers, 1)
        AS pct_active_to_highval,
    ROUND((stage_3_active_buyers - stage_4_high_value) * 100.0 / stage_3_active_buyers, 1)
        AS drop_off_3_to_4
FROM funnel;

-- -----------------------------------------------------------------

-- 2B: Funnel breakdown by preferred category
-- Shows which categories convert best at every stage.

WITH category_funnel AS (
    SELECT
        preferred_category,
        COUNT(*) AS total,

        SUM(CASE WHEN spending_score >= 40
                 THEN 1 ELSE 0 END)
            AS engaged,

        SUM(CASE WHEN spending_score >= 40
                  AND purchase_frequency >= 15
                 THEN 1 ELSE 0 END)
            AS active_buyers,

        SUM(CASE WHEN spending_score >= 40
                  AND purchase_frequency >= 15
                  AND last_purchase_amount >= 75
                 THEN 1 ELSE 0 END)
            AS high_value
    FROM customers
    GROUP BY preferred_category
)
SELECT
    preferred_category,
    total,
    engaged,
    ROUND(engaged * 100.0 / total, 1)           AS engaged_rate,
    active_buyers,
    ROUND(active_buyers * 100.0 / engaged, 1)   AS active_rate,
    high_value,
    ROUND(high_value * 100.0 / active_buyers, 1) AS high_value_rate
FROM category_funnel
ORDER BY high_value_rate DESC;

-- -----------------------------------------------------------------

-- 2C: Funnel by gender — identify demographic conversion gaps

WITH gender_funnel AS (
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
ORDER BY buyer_to_highval_rate DESC;

-- =================================================================
-- BUSINESS INSIGHT
-- =================================================================
-- The biggest drop-off stage tells you where the funnel leaks most.
-- If engagement-to-active-buyer conversion is low, the marketing
-- team should invest in retargeting and nurture campaigns for the
-- "engaged but not buying" segment. Categories with the highest
-- high-value conversion rates deserve more top-of-funnel spend
-- because they yield the best downstream ROI.
-- =================================================================
