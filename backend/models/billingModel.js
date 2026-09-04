const db = require("../config/db");


// Find customer using phone
const getCustomerByPhone = (phone, callback) => {

    const sql = `
        SELECT customer_id, customer_name, phone, email, address
        FROM customers
        WHERE phone = ?
    `;

    db.query(sql, [phone], callback);
};


// Get products
const getProducts = (callback) => {

    const sql = `
        SELECT id, product_name, price, quantity, is_active
        FROM products
        WHERE is_active = TRUE
        ORDER BY id DESC
    `;

    db.query(sql, callback);
};


// Create bill
const createBill = (
    customerId,
    total,
    paidAmount,
    returnAmount,
    callback
) => {

    const sql = `
        INSERT INTO bills
        (customer_id, total, paid_amount, return_amount)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            customerId,
            total,
            paidAmount,
            returnAmount
        ],
        callback
    );
};


// Create bill item
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
        (bill_id, product_id, quantity, price, item_total)
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


// Reduce product stock
const reduceProductQuantity = (
    productId,
    quantity,
    callback
) => {

    const sql = `
        UPDATE products
        SET quantity = quantity - ?
        WHERE id = ?
        AND is_active = TRUE
        AND quantity >= ?
    `;

    db.query(
        sql,
        [
            quantity,
            productId,
            quantity
        ],
        callback
    );
};


module.exports = {
    getCustomerByPhone,
    getProducts,
    createBill,
    createBillItem,
    reduceProductQuantity
};