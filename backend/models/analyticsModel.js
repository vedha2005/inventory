const db = require("../config/db");

// ==========================================
// 1. BRANCH-WISE SALES
// ==========================================
const getBranchSales = (callback) => {
    const query = `
        SELECT
            b.branch_id,
            br.branch_name,
            COALESCE(SUM(b.total), 0) AS total_sales
        FROM branches br
        LEFT JOIN bills b
            ON br.branch_id = b.branch_id
        GROUP BY
            b.branch_id,
            br.branch_name
        ORDER BY total_sales DESC
    `;

    db.query(query, callback);
};


// ==========================================
// 2. TOP-SELLING PRODUCTS
// ==========================================
const getTopProducts = (branchId, callback) => {

    let query = `
        SELECT
            p.id AS product_id,
            p.product_name,
            COALESCE(SUM(bi.quantity), 0) AS quantity_sold,
            COALESCE(SUM(bi.item_total), 0) AS total_sales
        FROM bill_items bi
        INNER JOIN bills b
            ON bi.bill_id = b.bill_id
        INNER JOIN products p
            ON bi.product_id = p.id
    `;

    const params = [];

    if (branchId) {
        query += `
            WHERE b.branch_id = ?
        `;

        params.push(branchId);
    }

    query += `
        GROUP BY
            p.id,
            p.product_name
        ORDER BY quantity_sold DESC
        LIMIT 10
    `;

    db.query(query, params, callback);
};


// ==========================================
// 3. LEAST-SELLING PRODUCTS
// ==========================================
const getLeastProducts = (branchId, callback) => {

    let query = `
        SELECT
            p.id AS product_id,
            p.product_name,
            COALESCE(SUM(bi.quantity), 0) AS quantity_sold,
            COALESCE(SUM(bi.item_total), 0) AS total_sales
        FROM products p
        LEFT JOIN bill_items bi
            ON p.id = bi.product_id
        LEFT JOIN bills b
            ON bi.bill_id = b.bill_id
    `;

    const params = [];

    if (branchId) {
        query += `
            WHERE b.branch_id = ?
               OR b.branch_id IS NULL
        `;

        params.push(branchId);
    }

    query += `
        GROUP BY
            p.id,
            p.product_name
        ORDER BY quantity_sold ASC
        LIMIT 10
    `;

    db.query(query, params, callback);
};


// ==========================================
// 4. DAILY SALES
// ==========================================
const getDailySales = (branchId, callback) => {

    let query = `
        SELECT
            DATE(b.bill_date) AS sale_date,
            COALESCE(SUM(b.total), 0) AS total_sales
        FROM bills b
    `;

    const params = [];

    if (branchId) {
        query += `
            WHERE b.branch_id = ?
        `;

        params.push(branchId);
    }

    query += `
        GROUP BY DATE(b.bill_date)
        ORDER BY sale_date ASC
    `;

    db.query(query, params, callback);
};


module.exports = {
    getBranchSales,
    getTopProducts,
    getLeastProducts,
    getDailySales
};