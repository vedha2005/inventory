const salesPredictionModel = require("../models/salesPredictionModel");


// ============================================================
// GET SALES + TOP PRODUCT PREDICTIONS
// ============================================================

const getSalesPrediction = (req, res) => {

    salesPredictionModel.getWeeklySalesPrediction(
        (err, salesResults) => {

            if (err) {

                console.error(
                    "Error fetching weekly sales prediction:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to fetch weekly sales prediction"
                });
            }


            // ------------------------------------------------
            // No sales prediction available
            // ------------------------------------------------

            if (
                !salesResults ||
                salesResults.length === 0
            ) {

                return res.status(404).json({
                    message:
                        "No weekly sales prediction available. Please run the ML model first."
                });
            }


            const salesPrediction =
                salesResults[0];


            const weekStart =
                salesPrediction.week_start_date;

            const weekEnd =
                salesPrediction.week_end_date;


            // ------------------------------------------------
            // Get Top 5 predicted products
            // ------------------------------------------------

            salesPredictionModel.getTopPredictedProducts(
                weekStart,
                weekEnd,
                (productErr, productResults) => {

                    if (productErr) {

                        console.error(
                            "Error fetching product predictions:",
                            productErr
                        );

                        return res.status(500).json({
                            message:
                                "Failed to fetch product predictions"
                        });
                    }


                    // ------------------------------------------------
                    // Final response
                    // ------------------------------------------------

                    return res.status(200).json({

                        week_start:
                            salesPrediction.week_start_date,

                        week_end:
                            salesPrediction.week_end_date,

                        expected_sales:
                            Number(
                                salesPrediction.predicted_sales
                            ),

                        historical_days:
                            salesPrediction.historical_days,

                        top_products:
                            productResults.map(
                                (product) => ({
                                    product_id:
                                        product.product_id,

                                    product_name:
                                        product.product_name,

                                    predicted_quantity:
                                        Number(
                                            product.predicted_quantity
                                        )
                                })
                            )
                    });
                }
            );
        }
    );
};


module.exports = {
    getSalesPrediction
};