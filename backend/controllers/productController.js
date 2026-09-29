const productModel = require("../models/productModel");

// Add Product
const addProduct = (req, res) => {
    const { productName, price, quantity } = req.body;

    if (!productName || price === undefined || quantity === undefined) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const role = req.headers["x-role"];
    const loggedInBranchId = req.headers["x-branch-id"];

    // Branch users can only add to their own branch
    if (role !== "SUPER_ADMIN" && !loggedInBranchId) {
        return res.status(403).json({
            success: false,
            message: "Branch information is required"
        });
    }

    // Super Admin must select a branch
    if (role === "SUPER_ADMIN" && !loggedInBranchId) {
        return res.status(400).json({
            success: false,
            message: "Please select a branch"
        });
    }

    const branchId = loggedInBranchId;

    productModel.addProduct(
        productName,
        price,
        quantity,
        branchId,
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


// Get Products
const getProducts = (req, res) => {
    const role = req.headers["x-role"];
    const branchId = req.headers["x-branch-id"];

    const isSuperAdmin = role === "SUPER_ADMIN";

    if (!isSuperAdmin && !branchId) {
        return res.status(403).json({
            success: false,
            message: "Branch information is required"
        });
    }

    productModel.getProducts(
        branchId,
        isSuperAdmin,
        (err, result) => {
            if (err) {
                console.log("GET PRODUCTS ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(200).json(result);
        }
    );
};


// Update Product
const updateProduct = (req, res) => {
    const { id } = req.params;
    const { productName, price, quantity } = req.body;

    if (!productName || price === undefined || quantity === undefined) {
        return res.status(400).json({
            success: false,
            message: "Product name, price, and quantity are required"
        });
    }

    const role = req.headers["x-role"];
    const branchId = req.headers["x-branch-id"];

    const isSuperAdmin = role === "SUPER_ADMIN";

    if (!isSuperAdmin && !branchId) {
        return res.status(403).json({
            success: false,
            message: "Branch information is required"
        });
    }

    productModel.updateProduct(
        id,
        productName,
        price,
        quantity,
        branchId,
        isSuperAdmin,
        (err, result) => {
            if (err) {
                console.log("UPDATE PRODUCT ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Product updated successfully"
            });
        }
    );
};


// Delete Product
const deleteProduct = (req, res) => {
    const { id } = req.params;

    const role = req.headers["x-role"];
    const branchId = req.headers["x-branch-id"];

    const isSuperAdmin = role === "SUPER_ADMIN";

    if (!isSuperAdmin && !branchId) {
        return res.status(403).json({
            success: false,
            message: "Branch information is required"
        });
    }

    productModel.deleteProduct(
        id,
        branchId,
        isSuperAdmin,
        (err, result) => {
            if (err) {
                console.log("DELETE PRODUCT ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Product Deleted Successfully"
            });
        }
    );
};


module.exports = {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct
};