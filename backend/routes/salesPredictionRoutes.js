const express = require("express");

const router = express.Router();

const salesPredictionController = require(
    "../controllers/salesPredictionController"
);


// GET weekly sales prediction
router.get(
    "/",
    salesPredictionController.getSalesPrediction
);


module.exports = router;