const db = require("../config/db");


// =====================================================
// FIND CUSTOMER BY PHONE
// =====================================================

const getCustomerByPhone = (phone, callback) => {

    const sql = `
        SELECT
            customer_id,
            customer_name,
            phone,
            email,
            address
        FROM customers
        WHERE phone = ?
        LIMIT 1
    `;

    db.query(
        sql,
        [phone],
        callback
    );
};


// =====================================================
// GET PRODUCTS FOR BILLING
// =====================================================
//
// Branch User:
// Shows ALL products
// Shows stock belonging to logged-in branch
//
// Super Admin:
// Shows ALL products
// Shows stock for ALL branches
// =====================================================

const getProducts = (
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
                p.is_active,
                bp.branch_id,
                b.branch_name,
                bp.quantity
            FROM products p

            LEFT JOIN branch_products bp
                ON p.id = bp.product_id

            LEFT JOIN branches b
                ON bp.branch_id = b.branch_id

            WHERE p.is_active = TRUE

            ORDER BY p.id DESC
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
                p.is_active,
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

            ORDER BY p.id DESC
        `;

        values = [branchId];
    }


    // No unnecessary console.log here

    db.query(
        sql,
        values,
        callback
    );
};


// =====================================================
// CREATE BILL
// =====================================================

const createBill = (
    customerId,
    total,
    paidAmount,
    returnAmount,
    branchId,
    callback
) => {

    const sql = `
        INSERT INTO bills
        (
            customer_id,
            total,
            paid_amount,
            return_amount,
            branch_id
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            customerId,
            total,
            paidAmount,
            returnAmount,
            branchId
        ],
        callback
    );
};


// =====================================================
// CREATE BILL ITEM
// =====================================================

const createBillItem = (
    billId,
    productId,
    quantity,
    price,
    itemTotal,
    callback
) => {

    const sql = `
        INSERT INTO bill_items
        (
            bill_id,
            product_id,
            quantity,
            price,
            item_total
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            billId,
            productId,
            quantity,
            price,
            itemTotal
        ],
        callback
    );
};


// =====================================================
// REDUCE BRANCH PRODUCT STOCK
// =====================================================

const reduceBranchProductQuantity = (
    productId,
    branchId,
    quantity,
    callback
) => {

    const sql = `
        UPDATE branch_products
        SET quantity = quantity - ?
        WHERE product_id = ?
        AND branch_id = ?
        AND quantity >= ?
    `;

    db.query(
        sql,
        [
            quantity,
            productId,
            branchId,
            quantity
        ],
        callback
    );
};


// =====================================================
// CHECK BRANCH PRODUCT STOCK
// =====================================================

const getBranchProductStock = (
    productId,
    branchId,
    callback
) => {

    const sql = `
        SELECT
            product_id,
            branch_id,
            quantity
        FROM branch_products
        WHERE product_id = ?
        AND branch_id = ?
        LIMIT 1
    `;

    db.query(
        sql,
        [
            productId,
            branchId
        ],
        callback
    );
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getCustomerByPhone,

    getProducts,

    createBill,

    createBillItem,

    reduceBranchProductQuantity,

    getBranchProductStock

};