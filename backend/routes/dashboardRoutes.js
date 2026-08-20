const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboardController");


// Dashboard counts
router.get(
    "/",
    dashboardController.getDashboardCounts
);


// Low stock products
router.get(
    "/low-stock",
    dashboardController.getLowStockProducts
);


module.exports = router;