const analyticsModel = require("../models/analyticsModel");

// ==========================================
// 1. BRANCH-WISE SALES
// ==========================================
const getBranchSales = (req, res) => {
    analyticsModel.getBranchSales((err, results) => {
        if (err) {
            console.error("Error fetching branch sales:", err);

            return res.status(500).json({
                message: "Failed to fetch branch sales"
            });
        }

        return res.status(200).json(results);
    });
};


// ==========================================
// 2. TOP-SELLING PRODUCTS
// ==========================================
const getTopProducts = (req, res) => {
    const branchId = req.query.branch_id || null;

    analyticsModel.getTopProducts(branchId, (err, results) => {
        if (err) {
            console.error("Error fetching top products:", err);

            return res.status(500).json({
                message: "Failed to fetch top-selling products"
            });
        }

        return res.status(200).json(results);
    });
};


// ==========================================
// 3. LEAST-SELLING PRODUCTS
// ==========================================
const getLeastProducts = (req, res) => {
    const branchId = req.query.branch_id || null;

    analyticsModel.getLeastProducts(branchId, (err, results) => {
        if (err) {
            console.error("Error fetching least-selling products:", err);

            return res.status(500).json({
                message: "Failed to fetch least-selling products"
            });
        }

        return res.status(200).json(results);
    });
};


// ==========================================
// 4. DAILY SALES
// ==========================================
const getDailySales = (req, res) => {
    const branchId = req.query.branch_id || null;

    analyticsModel.getDailySales(branchId, (err, results) => {
        if (err) {
            console.error("Error fetching daily sales:", err);

            return res.status(500).json({
                message: "Failed to fetch daily sales"
            });
        }

        return res.status(200).json(results);
    });
};


module.exports = {
    getBranchSales,
    getTopProducts,
    getLeastProducts,
    getDailySales
};