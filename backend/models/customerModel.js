const db = require("../config/db");

// ==========================
// Add Customer
// ==========================

const addCustomer = (
    customerName,
    phone,
    email,
    address,
    callback
) => {

    const sql =
        "INSERT INTO customers (customer_name, phone, email, address) VALUES (?, ?, ?, ?)";

    db.query(
        sql,
        [customerName, phone, email, address],
        callback
    );

};


// ==========================
// Get Customers
// ==========================

const getCustomers = (callback) => {

    const sql =
        "SELECT * FROM customers ORDER BY customer_id DESC";

    db.query(sql, callback);

};


// ==========================
// Get Customer By Phone
// ==========================

const getCustomerByPhone = (
    phone,
    callback
) => {

    const sql =
        "SELECT * FROM customers WHERE phone = ? LIMIT 1";

    db.query(
        sql,
        [phone],
        callback
    );

};


// ==========================
// Delete Customer
// ==========================

const deleteCustomer = (
    id,
    callback
) => {

    const sql =
        "DELETE FROM customers WHERE customer_id = ?";

    db.query(
        sql,
        [id],
        callback
    );

};


// ==========================
// EXPORT
// ==========================

module.exports = {

    addCustomer,

    getCustomers,

    getCustomerByPhone,

    deleteCustomer

};