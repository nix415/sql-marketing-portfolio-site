-- ============================================================
-- 05 | RFM SEGMENTATION
-- ============================================================
-- Goal: Classify every customer into High / Mid / Low value
-- tiers using Recency, Frequency, and Monetary scoring.
--
-- Mapping dataset columns to RFM dimensions:
--   Recency   → membership_years (inverted: fewer years = more recent)
--   Frequency → purchase_frequency
--   Monetary  → last_purchase_amount
--
-- We use NTILE(3) to split each dimension into thirds (1-3),
-- then combine the three scores into a composite RFM segment.
-- ============================================================

-- 5A: Assign R, F, M scores using NTILE(3)

WITH rfm_scores AS (
    SELECT
        id,
        age,
        gender,
        income,
        membership_years,
        purchase_frequency,
        last_purchase_amount,
        preferred_category,
        spending_score,

        -- Recency: lower membership_years = more recent signup → higher score
        NTILE(3) OVER (ORDER BY membership_years DESC) AS r_score,

        -- Frequency: higher purchase_frequency → higher score
        NTILE(3) OVER (ORDER BY purchase_frequency ASC) AS f_score,

        -- Monetary: higher last_purchase_amount → higher score
        NTILE(3) OVER (ORDER BY last_purchase_amount ASC) AS m_score
    FROM customers
),

-- 5B: Compute composite RFM score and assign value tier

rfm_segments AS (
    SELECT
        *,
        (r_score + f_score + m_score) AS rfm_total,
        CASE
            WHEN (r_score + f_score + m_score) >= 7 THEN 'High Value'
            WHEN (r_score + f_score + m_score) >= 5 THEN 'Mid Value'
            ELSE 'Low Value'
        END AS rfm_segment
    FROM rfm_scores
)

-- 5C: Summary view — segment-level KPIs for the marketing team

SELECT
    rfm_segment,
    COUNT(*)                                  AS customer_count,
    ROUND(AVG(income), 2)                     AS avg_income,
    ROUND(AVG(spending_score), 1)             AS avg_spending_score,
    ROUND(AVG(purchase_frequency), 1)         AS avg_purchase_freq,
    ROUND(AVG(last_purchase_amount), 2)       AS avg_last_purchase,
    ROUND(AVG(membership_years), 1)           AS avg_membership_years,
    ROUND(MIN(last_purchase_amount), 2)       AS min_purchase,
    ROUND(MAX(last_purchase_amount), 2)       AS max_purchase
FROM rfm_segments
GROUP BY rfm_segment
ORDER BY
    CASE rfm_segment
        WHEN 'High Value' THEN 1
        WHEN 'Mid Value'  THEN 2
        ELSE 3
    END;

-- -----------------------------------------------------------------

-- 5D: Full customer-level detail (export-friendly)
-- Every customer with their R, F, M scores and final segment.

WITH rfm_scores AS (
    SELECT
        id,
        age,
        gender,
        income,
        membership_years,
        purchase_frequency,
        last_purchase_amount,
        preferred_category,
        spending_score,
        NTILE(3) OVER (ORDER BY membership_years DESC)    AS r_score,
        NTILE(3) OVER (ORDER BY purchase_frequency ASC)   AS f_score,
        NTILE(3) OVER (ORDER BY last_purchase_amount ASC)  AS m_score
    FROM customers
)
SELECT
    id,
    age,
    gender,
    preferred_category,
    income,
    r_score,
    f_score,
    m_score,
    (r_score + f_score + m_score) AS rfm_total,
    CASE
        WHEN (r_score + f_score + m_score) >= 7 THEN 'High Value'
        WHEN (r_score + f_score + m_score) >= 5 THEN 'Mid Value'
        ELSE 'Low Value'
    END AS rfm_segment
FROM rfm_scores
ORDER BY rfm_total DESC, last_purchase_amount DESC;

-- -----------------------------------------------------------------

-- 5E: RFM segment × category heatmap data
-- Shows which categories dominate in each value tier.

WITH rfm_scores AS (
    SELECT
        *,
        NTILE(3) OVER (ORDER BY membership_years DESC)    AS r_score,
        NTILE(3) OVER (ORDER BY purchase_frequency ASC)   AS f_score,
        NTILE(3) OVER (ORDER BY last_purchase_amount ASC)  AS m_score
    FROM customers
),
rfm_segments AS (
    SELECT
        *,
        CASE
            WHEN (r_score + f_score + m_score) >= 7 THEN 'High Value'
            WHEN (r_score + f_score + m_score) >= 5 THEN 'Mid Value'
            ELSE 'Low Value'
        END AS rfm_segment
    FROM rfm_scores
)
SELECT
    rfm_segment,
    preferred_category,
    COUNT(*)                                AS customer_count,
    ROUND(AVG(last_purchase_amount), 2)     AS avg_order_value,
    ROUND(AVG(purchase_frequency), 1)       AS avg_freq
FROM rfm_segments
GROUP BY rfm_segment, preferred_category
ORDER BY
    CASE rfm_segment
        WHEN 'High Value' THEN 1
        WHEN 'Mid Value'  THEN 2
        ELSE 3
    END,
    customer_count DESC;

-- =================================================================
-- BUSINESS INSIGHT
-- =================================================================
-- High-Value customers should receive VIP treatment: early access,
-- loyalty rewards, and personalized upsell campaigns to maximize
-- LTV. Mid-Value customers are the biggest growth lever — targeted
-- promotions and re-engagement emails can push them into the High
-- tier. Low-Value customers need reactivation sequences; if they
-- don't respond, suppress them from paid campaigns to protect ROAS.
-- =================================================================
