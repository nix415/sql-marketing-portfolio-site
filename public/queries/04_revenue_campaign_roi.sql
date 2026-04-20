-- ============================================================
-- 04 | REVENUE & CAMPAIGN ROI ANALYSIS
-- ============================================================
-- Goal: Break down revenue contribution and average order value
-- by category (channel proxy), customer segment, and demographic
-- to help the marketing team allocate budget to the highest-ROI
-- segments.
-- ============================================================

-- 4A: Revenue by preferred category (channel-level view)
-- Treats each category as a "campaign channel" and compares
-- total revenue, AOV, and customer volume.

WITH channel_revenue AS (
    SELECT
        preferred_category                        AS channel,
        COUNT(*)                                  AS customers,
        SUM(last_purchase_amount)                 AS total_revenue,
        ROUND(AVG(last_purchase_amount), 2)       AS avg_order_value,
        ROUND(SUM(last_purchase_amount) * 1.0 /
              SUM(purchase_frequency), 2)         AS revenue_per_transaction,
        SUM(purchase_frequency)                   AS total_transactions
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
    ROUND(cr.total_revenue * 100.0 / gt.overall_revenue, 1)
                                          AS pct_of_revenue,
    cr.avg_order_value,
    cr.revenue_per_transaction,
    cr.total_transactions
FROM channel_revenue cr
CROSS JOIN grand_total gt
ORDER BY cr.total_revenue DESC;

-- -----------------------------------------------------------------

-- 4B: Revenue by income tier — simulates campaign-tier ROI
-- Segments customers into income quartiles and compares returns.

WITH income_tiers AS (
    SELECT
        *,
        NTILE(4) OVER (ORDER BY income) AS income_quartile
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
ORDER BY income_quartile;

-- -----------------------------------------------------------------

-- 4C: Top category × gender combinations by revenue
-- Pinpoints the highest-revenue demographic × channel combos
-- so the team knows exactly where to double down.

SELECT
    preferred_category                    AS channel,
    gender,
    COUNT(*)                              AS customers,
    SUM(last_purchase_amount)             AS total_revenue,
    ROUND(AVG(last_purchase_amount), 2)   AS avg_order_value,
    ROUND(AVG(purchase_frequency), 1)     AS avg_freq
FROM customers
GROUP BY preferred_category, gender
ORDER BY total_revenue DESC
LIMIT 10;

-- -----------------------------------------------------------------

-- 4D: Revenue efficiency — revenue per membership year
-- Helps measure customer lifetime value trajectory.

SELECT
    membership_years,
    COUNT(*)                              AS customers,
    SUM(last_purchase_amount)             AS total_revenue,
    ROUND(AVG(last_purchase_amount), 2)   AS avg_order_value,
    ROUND(SUM(last_purchase_amount) * 1.0 / COUNT(*), 2)
                                          AS revenue_per_customer,
    ROUND(AVG(purchase_frequency), 1)     AS avg_purchase_freq
FROM customers
GROUP BY membership_years
ORDER BY membership_years;

-- =================================================================
-- BUSINESS INSIGHT
-- =================================================================
-- Categories (channels) with high total revenue but low AOV are
-- volume plays — scale them with broad-reach campaigns. Categories
-- with high AOV but fewer customers are premium segments worth
-- targeting with personalized ads. The income-tier breakdown tells
-- the team whether to optimize for volume (lower tiers) or margin
-- (upper tiers) depending on current growth objectives.
-- =================================================================
