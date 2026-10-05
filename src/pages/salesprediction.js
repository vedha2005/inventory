import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/salesprediction.css";

function SalesPrediction() {

    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ========================================================
    // LOAD SALES PREDICTION
    // ========================================================

    useEffect(() => {

        const loadPrediction = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await axios.get(
                    "http://localhost:5000/api/sales-prediction"
                );

                setPrediction(response.data);

            } catch (err) {

                console.error(
                    "Sales Prediction Error:",
                    err
                );

                if (
                    err.response &&
                    err.response.status === 404
                ) {

                    setError(
                        "No prediction available. Please run the ML model first."
                    );

                } else {

                    setError(
                        "Unable to load sales prediction."
                    );
                }

            } finally {

                setLoading(false);

            }
        };


        loadPrediction();

    }, []);


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <div className="sales-prediction-container">

                <div className="sales-prediction-header">

                    <p>Machine Learning</p>

                    <h1>
                        📈 Sales Prediction
                    </h1>

                    <span>
                        Loading prediction data...
                    </span>

                </div>

                <div className="prediction-message">
                    Loading real prediction data...
                </div>

            </div>
        );
    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (
            <div className="sales-prediction-container">

                <div className="sales-prediction-header">

                    <p>Machine Learning</p>

                    <h1>
                        📈 Sales Prediction
                    </h1>

                    <span>
                        Weekly sales and product prediction
                    </span>

                </div>

                <div className="prediction-error">
                    {error}
                </div>

            </div>
        );
    }


    // ========================================================
    // NO DATA
    // ========================================================

    if (!prediction) {

        return (
            <div className="sales-prediction-container">

                <div className="sales-prediction-header">

                    <p>Machine Learning</p>

                    <h1>
                        📈 Sales Prediction
                    </h1>

                </div>

                <div className="prediction-message">
                    No prediction data available.
                </div>

            </div>
        );
    }


    // ========================================================
    // FORMAT DATES
    // ========================================================

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "-";
        }

        const date = new Date(dateValue);

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // ========================================================
    // FORMAT CURRENCY
    // ========================================================

    const formatCurrency = (value) => {

        return `₹${Number(value).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;
    };


    // ========================================================
    // MAIN PAGE
    // ========================================================

    return (

        <div className="sales-prediction-container">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="sales-prediction-header">

                <div>

                    <p>
                        Machine Learning
                    </p>

                    <h1>
                        📈 Sales Prediction
                    </h1>

                    <span>
                        Predictive insights for the next 7 days
                    </span>

                </div>

            </div>


            {/* =================================================
                PREDICTION PERIOD
            ================================================= */}

            <div className="prediction-period-card">

                <div>

                    <span className="prediction-label">
                        Prediction Period
                    </span>

                    <h2>
                        {formatDate(
                            prediction.week_start
                        )}
                        {" "}
                        →{" "}
                        {formatDate(
                            prediction.week_end
                        )}
                    </h2>

                </div>


                <div>

                    <span className="prediction-label">
                        Historical Data
                    </span>

                    <h2>
                        {prediction.historical_days} days
                    </h2>

                </div>

            </div>


            {/* =================================================
                EXPECTED SALES
            ================================================= */}

            <section className="expected-sales-card">

                <div className="expected-sales-content">

                    <div>

                        <span className="prediction-label">
                            Expected Sales
                        </span>

                        <h2>
                            {formatCurrency(
                                prediction.expected_sales
                            )}
                        </h2>

                        <p>
                            Predicted total sales for the
                            next 7 days
                        </p>

                    </div>

                    <div className="prediction-icon">
                        📈
                    </div>

                </div>

            </section>


            {/* =================================================
                TOP PRODUCTS
            ================================================= */}

            <section className="top-products-card">

                <div className="prediction-card-header">

                    <div>

                        <h2>
                            🏆 Products Expected to Sell Most
                        </h2>

                        <p>
                            Top products predicted to have
                            the highest sales quantity
                        </p>

                    </div>

                </div>


                {prediction.top_products &&
                prediction.top_products.length > 0 ? (

                    <div className="top-products-list">

                        {prediction.top_products.map(
                            (product, index) => (

                                <div
                                    className="top-product-item"
                                    key={product.product_id}
                                >

                                    <div className="product-rank">
                                        {index + 1}
                                    </div>


                                    <div className="product-info">

                                        <h3>
                                            {product.product_name}
                                        </h3>

                                        <span>
                                            Product ID:{" "}
                                            {product.product_id}
                                        </span>

                                    </div>


                                    <div className="predicted-quantity">

                                        <strong>
                                            {Number(
                                                product.predicted_quantity
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                        <span>
                                            units
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                ) : (

                    <div className="prediction-message">

                        No product predictions available.

                    </div>

                )}

            </section>


            {/* =================================================
                ML INFORMATION
            ================================================= */}

            <section className="ml-info-card">

                <h2>
                    🤖 About This Prediction
                </h2>

                <p>
                    The prediction is generated using
                    historical sales data from the SuperMart
                    database. A machine learning model analyzes
                    previous sales patterns to estimate total
                    sales for the next 7 days and identify the
                    products expected to sell the most.
                </p>

                <div className="ml-info-grid">

                    <div>

                        <strong>
                            Data Source
                        </strong>

                        <span>
                            SQLMesh daily sales analytics
                        </span>

                    </div>


                    <div>

                        <strong>
                            Prediction Period
                        </strong>

                        <span>
                            Next 7 days
                        </span>

                    </div>


                    <div>

                        <strong>
                            Model
                        </strong>

                        <span>
                            Linear Regression
                        </span>

                    </div>


                    <div>

                        <strong>
                            Historical Data
                        </strong>

                        <span>
                            {prediction.historical_days} days
                        </span>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default SalesPrediction;