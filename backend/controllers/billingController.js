const billingModel = require("../models/billingModel");


// =====================================================
// FIND CUSTOMER BY PHONE
// =====================================================

const getCustomerByPhone = (req, res) => {

    const { phone } = req.params;

    billingModel.getCustomerByPhone(
        phone,
        (err, result) => {

            if (err) {

                console.log(
                    "CUSTOMER ERROR:",
                    err
                );

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


            res.status(200).json({
                success: true,
                customer: result[0]
            });

        }
    );
};


// =====================================================
// GET PRODUCTS FOR BILLING
// =====================================================

const getProducts = (req, res) => {

    const branchId =
        req.query.branch_id;

    const role =
        req.query.role;

    const isSuperAdmin =
        role === "SUPER_ADMIN";


    // =================================================
    // CHECK BRANCH
    // =================================================

    if (
        !isSuperAdmin &&
        !branchId
    ) {

        return res.status(400).json({
            success: false,
            message: "Branch ID is required"
        });
    }


    billingModel.getProducts(
        branchId,
        isSuperAdmin,
        (err, result) => {

            if (err) {

                console.log(
                    "BILLING PRODUCTS ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }


            return res.status(200).json({

                success: true,

                products: result

            });

        }
    );
};


// =====================================================
// CREATE BILL
// =====================================================

const createBill = (req, res) => {

    const {
        customerId,
        total,
        paidAmount,
        returnAmount,
        branchId,
        items
    } = req.body;


    // =================================================
    // CUSTOMER VALIDATION
    // =================================================

    if (!customerId) {

        return res.status(400).json({
            success: false,
            message: "Customer ID is required"
        });
    }


    // =================================================
    // BRANCH VALIDATION
    // =================================================

    if (!branchId) {

        return res.status(400).json({
            success: false,
            message: "Branch ID is required"
        });
    }


    // =================================================
    // PRODUCT VALIDATION
    // =================================================

    if (
        !items ||
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return res.status(400).json({
            success: false,
            message: "Add at least one product"
        });
    }


    // =================================================
    // PAYMENT VALIDATION
    // =================================================

    if (
        total === undefined ||
        paidAmount === undefined ||
        returnAmount === undefined
    ) {

        return res.status(400).json({
            success: false,
            message: "Billing amount details are required"
        });
    }


    let checkedItems = 0;


    // =================================================
    // CHECK STOCK
    // =================================================

    const checkStock = () => {

        if (
            checkedItems ===
            items.length
        ) {

            saveBill();

            return;
        }


        const item =
            items[checkedItems];


        const productId =
            Number(item.productId);


        const requestedQuantity =
            Number(item.quantity);


        // =================================================
        // PRODUCT QUANTITY VALIDATION
        // =================================================

        if (
            !productId ||
            !requestedQuantity ||
            requestedQuantity <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid product quantity"
            });
        }


        billingModel.getBranchProductStock(
            productId,
            branchId,
            (err, result) => {

                if (err) {

                    console.log(
                        "STOCK CHECK ERROR:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Unable to check stock"
                    });
                }


                // =================================================
                // PRODUCT NOT AVAILABLE
                // =================================================

                if (
                    result.length === 0
                ) {

                    return res.status(400).json({
                        success: false,
                        message:
                            `Product ${productId} is not available in this branch`
                    });
                }


                const availableStock =
                    Number(
                        result[0].quantity
                    );


                // =================================================
                // INSUFFICIENT STOCK
                // =================================================

                if (
                    requestedQuantity >
                    availableStock
                ) {

                    return res.status(400).json({
                        success: false,
                        message:
                            `Insufficient stock for product ${productId}. Available stock: ${availableStock}`
                    });
                }


                checkedItems++;

                checkStock();

            }
        );
    };


    // =================================================
    // SAVE BILL
    // =================================================

    const saveBill = () => {

        billingModel.createBill(
            customerId,
            total,
            paidAmount,
            returnAmount,
            branchId,
            (err, result) => {

                if (err) {

                    console.log(
                        "BILL ERROR:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Failed to create bill"
                    });
                }


                const billId =
                    result.insertId;


                let completedItems = 0;


                // =================================================
                // SAVE EACH BILL ITEM
                // =================================================

                items.forEach((item) => {

                    const productId =
                        Number(item.productId);


                    const itemQuantity =
                        Number(item.quantity);


                    const itemPrice =
                        Number(item.price);


                    const itemTotal =
                        itemPrice *
                        itemQuantity;


                    billingModel.createBillItem(
                        billId,
                        productId,
                        itemQuantity,
                        itemPrice,
                        itemTotal,
                        (itemErr) => {

                            if (itemErr) {

                                console.log(
                                    "BILL ITEM ERROR:",
                                    itemErr
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Failed to save bill item"
                                });
                            }


                            // =================================================
                            // REDUCE STOCK
                            // =================================================

                            billingModel.reduceBranchProductQuantity(
                                productId,
                                branchId,
                                itemQuantity,
                                (stockErr, stockResult) => {

                                    if (stockErr) {

                                        console.log(
                                            "STOCK UPDATE ERROR:",
                                            stockErr
                                        );

                                        return res.status(500).json({
                                            success: false,
                                            message:
                                                "Failed to update stock"
                                        });
                                    }


                                    if (
                                        stockResult.affectedRows === 0
                                    ) {

                                        return res.status(400).json({
                                            success: false,
                                            message:
                                                `Insufficient stock for product ${productId}`
                                        });
                                    }


                                    completedItems++;


                                    // =================================================
                                    // ALL ITEMS COMPLETED
                                    // =================================================

                                    if (
                                        completedItems ===
                                        items.length
                                    ) {

                                        return res.status(201).json({

                                            success: true,

                                            message:
                                                "Bill saved successfully",

                                            billId

                                        });
                                    }

                                }
                            );

                        }
                    );

                });

            }
        );
    };


    // =================================================
    // START STOCK CHECK
    // =================================================

    checkStock();

};


module.exports = {

    getCustomerByPhone,

    getProducts,

    createBill

};