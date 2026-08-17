const db = require("../config/db");

const getDashboardCounts = (callback) => {

    const sql = `
        SELECT
            (SELECT COUNT(*) FROM products) AS totalProducts,
            (SELECT COUNT(*) FROM customers) AS totalCustomers
    `;

    db.query(sql, callback);
};

module.exports = {
    getDashboardCounts
};