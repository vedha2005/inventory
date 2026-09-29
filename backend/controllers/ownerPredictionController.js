const db = require("../config/db");

// Get latest owner sales prediction
const getOwnerPrediction = (req, res) => {
    const query = `
        SELECT
            prediction_id,
            prediction_date,
            predicted_sales,
            historical_days,
            created_at
        FROM owner_predictions
        ORDER BY prediction_date DESC
        LIMIT 1
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching owner prediction:", err);

            return res.status(500).json({
                message: "Failed to fetch owner prediction"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "No sales prediction available yet"
            });
        }

        return res.status(200).json({
            message: "Owner prediction fetched successfully",
            prediction: results[0]
        });
    });
};

module.exports = {
    getOwnerPrediction
};