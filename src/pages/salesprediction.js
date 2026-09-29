import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/salesprediction.css";

function SalesPrediction() {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/owner-prediction")
            .then((response) => {
                console.log("Sales Prediction:", response.data);

                if (response.data.prediction) {
                    setPrediction(response.data.prediction);
                } else {
                    setMessage(
                        response.data.message ||
                        "No sales prediction available yet."
                    );
                }
            })
            .catch((error) => {
                console.log("Sales Prediction Error:", error);

                if (
                    error.response &&
                    error.response.status === 404
                ) {
                    setMessage(
                        error.response.data.message ||
                        "No sales prediction available yet."
                    );
                } else {
                    setMessage(
                        "Unable to load sales prediction."
                    );
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="sales-prediction-container">

            <div className="sales-prediction-header">
                <p>Owner Analytics</p>

                <h1>📈 Sales Prediction</h1>

                <span>
                    ML-based sales forecasting
                </span>
            </div>

            {loading ? (
                <div className="prediction-card">
                    <h2>Loading prediction...</h2>

                    <p>
                        Fetching the latest prediction.
                    </p>
                </div>

            ) : prediction ? (

                <div className="prediction-card">

                    <p className="prediction-label">
                        Expected Sales
                    </p>

                    <h2>
                        ₹
                        {Number(
                            prediction.predicted_sales
                        ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </h2>

                    <p>
                        Prediction Date:{" "}
                        <strong>
                            {new Date(
                                prediction.prediction_date
                            ).toLocaleDateString("en-IN")}
                        </strong>
                    </p>

                    <p>
                        Based on{" "}
                        <strong>
                            {prediction.historical_days}
                        </strong>{" "}
                        historical sales days.
                    </p>

                </div>

            ) : (

                <div className="prediction-card">

                    <h2>
                        Data unavailable
                    </h2>

                    <p>
                        {message}
                    </p>

                    <p>
                        The ML model will generate a
                        prediction when enough real
                        historical sales data is available.
                    </p>

                </div>
            )}

        </div>
    );
}

export default SalesPrediction;