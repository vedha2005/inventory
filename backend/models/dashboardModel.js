const db = require("../config/db");

// Dashboard Counts
const getDashboardCounts = (callback) => {

    const sql = `
        SELECT
            (SELECT COUNT(*) FROM products) AS totalProducts,
            (SELECT COUNT(*) FROM customers) AS totalCustomers
    `;

    db.query(sql, callback);
};


// Low Stock Products
const getLowStockProducts = (callback) => {

    const sql = `
        SELECT id, product_name, quantity
        FROM products
        WHERE quantity <= 10
        ORDER BY quantity ASC
    `;

    db.query(sql, callback);
};


module.exports = {
    getDashboardCounts,
    getLowStockProducts
};