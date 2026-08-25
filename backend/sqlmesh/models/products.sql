MODEL (
    name analytics.products,
    kind FULL
);

SELECT
    id,
    product_name,
    price,
    quantity
FROM supermart.products;