const productModel = require("../models/productModel");

// Add Product
const addProduct = (req, res) => {

    const { productName, price, quantity } = req.body;

    if (!productName || !price || !quantity) {

        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });

    }

    productModel.addProduct(
        productName,
        price,
        quantity,
        (err, result) => {

            if (err) {

                console.log("ADD PRODUCT ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.status(201).json({
                success: true,
                message: "Product Added Successfully"
            });

        }
    );
};


// Get All Products
const getProducts = (req, res) => {

    productModel.getProducts((err, result) => {

        if (err) {

            console.log("GET PRODUCTS ERROR:", err);

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        res.status(200).json(result);

    });
};


// Delete Product
const deleteProduct = (req, res) => {

    const { id } = req.params;

    console.log("Deleting product ID:", id);

    productModel.deleteProduct(id, (err, result) => {

        if (err) {

            console.log("DELETE PRODUCT ERROR:");
            console.log(err);

            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        console.log("Delete result:", result);

        res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        });

    });

};


module.exports = {
    addProduct,
    getProducts,
    deleteProduct
};