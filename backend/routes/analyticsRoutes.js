const express = require("express");

const router = express.Router();

const analyticsController = require(
    "../controllers/analyticsController"
);


// ==========================================
// BRANCH-WISE SALES
// ==========================================
router.get(
    "/branch-sales",
    analyticsController.getBranchSales
);


// ==========================================
// TOP-SELLING PRODUCTS
// ==========================================
router.get(
    "/top-products",
    analyticsController.getTopProducts
);


// ==========================================
// LEAST-SELLING PRODUCTS
// ==========================================
router.get(
    "/least-products",
    analyticsController.getLeastProducts
);


// ==========================================
// DAILY SALES
// ==========================================
router.get(
    "/daily-sales",
    analyticsController.getDailySales
);


module.exports = router;