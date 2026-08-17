const db = require("../config/db");

// Add Product
const addProduct = (productName, price, quantity, callback) => {

    const sql =
        "INSERT INTO products (product_name, price, quantity) VALUES (?, ?, ?)";

    db.query(
        sql,
        [productName, price, quantity],
        callback
    );

};


// Get Active Products
const getProducts = (callback) => {

    const sql =
        "SELECT * FROM products WHERE is_active = TRUE ORDER BY id DESC";

    db.query(sql, callback);

};


// Delete Product
const deleteProduct = (id, callback) => {

    const sql =
        "UPDATE products SET is_active = FALSE WHERE id = ?";

    db.query(sql, [id], callback);

};



module.exports = {
    addProduct,
    getProducts,
    deleteProduct
};