const billingModel = require("../models/billingModel");


// Find customer by phone
const getCustomerByPhone = (req, res) => {

    const { phone } = req.params;

    billingModel.getCustomerByPhone(
        phone,
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (result.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Customer not found"
                });
            }

            res.json({
                success: true,
                customer: result[0]
            });
        }
    );
};


// Get products
const getProducts = (req, res) => {

    billingModel.getProducts(
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            res.json({
                success: true,
                products: result
            });
        }
    );
};


// Save bill
const createBill = (req, res) => {

    const {
        customerId,
        total,
        paidAmount,
        returnAmount,
        items
    } = req.body;


    console.log("BILL DATA RECEIVED:");
    console.log(req.body);


    if (!customerId) {

        return res.status(400).json({
            success: false,
            message: "Customer ID is required"
        });
    }


    if (!items || items.length === 0) {

        return res.status(400).json({
            success: false,
            message: "Add at least one product"
        });
    }


    billingModel.createBill(
        customerId,
        total,
        paidAmount,
        returnAmount,
        (err, result) => {

            if (err) {

                console.log("BILL INSERT ERROR:");
                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }


            const billId = result.insertId;

            let completed = 0;


            items.forEach((item) => {

                const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);


                billingModel.createBillItem(
                    billId,
                    item.productId,
                    item.quantity,
                    item.price,
                    itemTotal,
                    (itemErr) => {

                        if (itemErr) {

                            console.log("ITEM INSERT ERROR:");
                            console.log(itemErr);

                            return res.status(500).json({
                                success: false,
                                message: itemErr.message
                            });
                        }


                        completed++;


                        if (completed === items.length) {

                            res.status(201).json({
                                success: true,
                                message: "Bill saved successfully",
                                billId: billId
                            });
                        }

                    }
                );

            });

        }
    );
};


module.exports = {
    getCustomerByPhone,
    getProducts,
    createBill
};