const db = require("../config/db");


// =====================================================
// DASHBOARD COUNTS
// =====================================================
//
// Branch User:
// Counts products available in their branch.
//
// Super Admin:
// Counts all products.
//
// Customers are global, so all users see total customers.
// =====================================================

const getDashboardCounts = (
    branchId,
    isSuperAdmin,
    callback
) => {

    let sql;
    let values = [];


    // =================================================
    // SUPER ADMIN
    // =================================================

    if (isSuperAdmin) {

        sql = `
            SELECT
                COUNT(DISTINCT p.id) AS totalProducts,
                (
                    SELECT COUNT(*)
                    FROM customers
                ) AS totalCustomers
            FROM products p
            WHERE p.is_active = TRUE
        `;

    }


    // =================================================
    // BRANCH USER
    // =================================================

    else {

        sql = `
            SELECT
                COUNT(DISTINCT p.id) AS totalProducts,
                (
                    SELECT COUNT(*)
                    FROM customers
                ) AS totalCustomers
            FROM products p

            INNER JOIN branch_products bp
                ON p.id = bp.product_id

            WHERE p.is_active = TRUE
            AND bp.branch_id = ?
        `;

        values = [branchId];
    }


    db.query(
        sql,
        values,
        callback
    );
};


// =====================================================
// LOW STOCK PRODUCTS
// =====================================================
//
// LOW STOCK = quantity <= 10
//
// Branch User:
// → Only their branch
//
// Super Admin:
// → All branches
// → Includes branch name
// =====================================================

const getLowStockProducts = (
    branchId,
    isSuperAdmin,
    callback
) => {

    let sql;
    let values = [];


    // =================================================
    // SUPER ADMIN
    // =================================================

    if (isSuperAdmin) {

        sql = `
            SELECT
                p.id,
                p.product_name,
                p.price,
                bp.branch_id,
                b.branch_name,
                bp.quantity

            FROM products p

            INNER JOIN branch_products bp
                ON p.id = bp.product_id

            INNER JOIN branches b
                ON bp.branch_id = b.branch_id

            WHERE p.is_active = TRUE
            AND bp.quantity <= 10

            ORDER BY
                bp.quantity ASC,
                b.branch_name ASC,
                p.product_name ASC
        `;

    }


    // =================================================
    // BRANCH USER
    // =================================================

    else {

        sql = `
            SELECT
                p.id,
                p.product_name,
                p.price,
                bp.branch_id,
                b.branch_name,
                bp.quantity

            FROM products p

            INNER JOIN branch_products bp
                ON p.id = bp.product_id

            INNER JOIN branches b
                ON bp.branch_id = b.branch_id

            WHERE p.is_active = TRUE
            AND bp.branch_id = ?
            AND bp.quantity <= 10

            ORDER BY
                bp.quantity ASC,
                p.product_name ASC
        `;

        values = [branchId];
    }


    db.query(
        sql,
        values,
        callback
    );
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getDashboardCounts,

    getLowStockProducts

};