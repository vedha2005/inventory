const express = require("express");

const router = express.Router();

const billingController =
    require("../controllers/billingController");


// Find customer by phone
router.get(
    "/customer/:phone",
    billingController.getCustomerByPhone
);


// Get billing products
router.get(
    "/products",
    billingController.getProducts
);


// Create bill
router.post(
    "/",
    billingController.createBill
);


module.exports = router;