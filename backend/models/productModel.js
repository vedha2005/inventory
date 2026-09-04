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

const updateProduct = (id, productName, price, quantity, callback) => {
    const sql = `
        UPDATE products
        SET product_name = ?, price = ?, quantity = ?
        WHERE id = ? AND is_active = TRUE
    `;

    db.query(sql, [productName, price, quantity, id], callback);
};



module.exports = {
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct
};