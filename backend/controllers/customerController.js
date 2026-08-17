const customerModel = require("../models/customerModel");


// ==========================
// Add Customer
// ==========================

const addCustomer = (req, res) => {

    const {
        customerName,
        phone,
        email,
        address
    } = req.body;


    if (!customerName || !phone) {

        return res.status(400).json({
            success: false,
            message: "Customer name and phone are required"
        });

    }


    customerModel.addCustomer(
        customerName,
        phone,
        email,
        address,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }


            res.status(201).json({
                success: true,
                message: "Customer Added Successfully"
            });

        }
    );

};


// ==========================
// Get All Customers
// ==========================

const getCustomers = (req, res) => {

    customerModel.getCustomers(
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }


            res.status(200).json(result);

        }
    );

};


// ==========================
// Find Customer By Phone
// ==========================

const getCustomerByPhone = (req, res) => {

    const { phone } = req.params;


    customerModel.getCustomerByPhone(
        phone,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }


            if (result.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Customer Not Found"
                });

            }


            res.status(200).json({
                success: true,
                customer: result[0]
            });

        }
    );

};


// ==========================
// Delete Customer
// ==========================

const deleteCustomer = (req, res) => {

    const { id } = req.params;


    customerModel.deleteCustomer(
        id,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }


            res.status(200).json({
                success: true,
                message: "Customer Deleted Successfully"
            });

        }
    );

};


// ==========================
// EXPORT
// ==========================

module.exports = {

    addCustomer,
    getCustomers,
    getCustomerByPhone,
    deleteCustomer

};