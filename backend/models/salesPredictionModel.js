const db = require("../config/db");


// ============================================================
// GET WEEKLY SALES PREDICTION
// ============================================================

const getWeeklySalesPrediction = (callback) => {

    const query = `
        SELECT
            prediction_id,
            week_start_date,
            week_end_date,
            predicted_sales,
            historical_days,
            created_at
        FROM weekly_sales_predictions
        ORDER BY prediction_id DESC
        LIMIT 1
    `;

    db.query(query, callback);
};


// ============================================================
// GET TOP 5 PREDICTED PRODUCTS
// ============================================================

const getTopPredictedProducts = (
    weekStart,
    weekEnd,
    callback
) => {

    const query = `
        SELECT
            prediction_id,
            product_id,
            product_name,
            week_start_date,
            week_end_date,
            predicted_quantity,
            created_at
        FROM weekly_product_predictions
        WHERE week_start_date = ?
          AND week_end_date = ?
        ORDER BY predicted_quantity DESC
        LIMIT 5
    `;

    db.query(
        query,
        [weekStart, weekEnd],
        callback
    );
};


module.exports = {
    getWeeklySalesPrediction,
    getTopPredictedProducts
};