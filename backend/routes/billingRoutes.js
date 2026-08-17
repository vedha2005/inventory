const express = require("express");

const router = express.Router();

const billingController =
    require("../controllers/billingController");


router.get(
    "/customer/:phone",
    billingController.getCustomerByPhone
);


router.get(
    "/products",
    billingController.getProducts
);


router.post(
    "/",
    billingController.createBill
);


module.exports = router;