const express = require("express");

const router = express.Router();

const ownerPredictionController = require(
    "../controllers/ownerPredictionController"
);

router.get(
    "/",
    ownerPredictionController.getOwnerPrediction
);

module.exports = router;