MODEL (
    name analytics.daily_sales,
    kind FULL,
    start '2026-08-01'
);

SELECT
    bi.product_id,
    p.product_name,
    DATE(b.bill_date) AS sale_date,
    SUM(bi.quantity) AS quantity_sold,
    SUM(bi.item_total) AS total_sales
FROM supermart.bill_items AS bi
JOIN supermart.bills AS b
    ON bi.bill_id = b.bill_id
JOIN supermart.products AS p
    ON bi.product_id = p.id
GROUP BY
    bi.product_id,
    p.product_name,
    DATE(b.bill_date);