const express = require("express");

const router = express.Router();

const customerController =
    require("../controllers/customerController");


// Add Customer
router.post(
    "/",
    customerController.addCustomer
);


// Get All Customers
router.get(
    "/",
    customerController.getCustomers
);


// Find Customer By Phone
router.get(
    "/phone/:phone",
    customerController.getCustomerByPhone
);


// Delete Customer
router.delete(
    "/:id",
    customerController.deleteCustomer
);


module.exports = router;