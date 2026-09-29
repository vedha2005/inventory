const db = require("../config/db");

// ===============================
// Add Product
// ===============================
const addProduct = (
    productName,
    price,
    quantity,
    branchId,
    callback
) => {

    const sql = `
        INSERT INTO products
        (product_name, price, quantity, branch_id)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [productName, price, quantity, branchId],
        callback
    );
};


// ===============================
// Get Products
// ===============================
const getProducts = (
    branchId,
    isSuperAdmin,
    callback
) => {

    let sql;
    let values = [];

    // SUPER ADMIN
    // Shows products from all branches
    if (isSuperAdmin) {

        sql = `
            SELECT
                p.id,
                p.product_name,
                p.price,
                p.is_active,
                bp.branch_id,
                bp.quantity
            FROM products p
            LEFT JOIN branch_products bp
                ON p.id = bp.product_id
            WHERE p.is_active = TRUE
            ORDER BY p.id DESC
        `;

    }

    // BRANCH USER
    // Shows ALL products,
    // but only stock belonging to that branch
    else {

        sql = `
            SELECT
                p.id,
                p.product_name,
                p.price,
                p.is_active,
                bp.branch_id,
                bp.quantity
            FROM products p
            INNER JOIN branch_products bp
                ON p.id = bp.product_id
            WHERE p.is_active = TRUE
            AND bp.branch_id = ?
            ORDER BY p.id DESC
        `;

        values = [branchId];
    }

    db.query(
        sql,
        values,
        callback
    );
};


// ===============================
// Delete Product
// ===============================
const deleteProduct = (
    id,
    branchId,
    isSuperAdmin,
    callback
) => {

    let sql;
    let values;

    // SUPER ADMIN
    if (isSuperAdmin) {

        sql = `
            UPDATE products
            SET is_active = FALSE
            WHERE id = ?
        `;

        values = [id];

    }

    // BRANCH USER
    else {

        sql = `
            UPDATE products
            SET is_active = FALSE
            WHERE id = ?
            AND branch_id = ?
        `;

        values = [
            id,
            branchId
        ];
    }

    db.query(
        sql,
        values,
        callback
    );
};


// ===============================
// Update Product
// ===============================
const updateProduct = (
    id,
    productName,
    price,
    quantity,
    branchId,
    isSuperAdmin,
    callback
) => {

    let sql;
    let values;

    // SUPER ADMIN
    if (isSuperAdmin) {

        sql = `
            UPDATE products
            SET product_name = ?,
                price = ?,
                quantity = ?
            WHERE id = ?
            AND is_active = TRUE
        `;

        values = [
            productName,
            price,
            quantity,
            id
        ];

    }

    // BRANCH USER
    else {

        sql = `
            UPDATE products
            SET product_name = ?,
                price = ?,
                quantity = ?
            WHERE id = ?
            AND branch_id = ?
            AND is_active = TRUE
        `;

        values = [
            productName,
            price,
            quantity,
            id,
            branchId
        ];
    }

    db.query(
        sql,
        values,
        callback
    );
};


// ===============================
// EXPORTS
// ===============================
module.exports = {
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct
};