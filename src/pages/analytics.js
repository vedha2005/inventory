import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

import "../css/analytics.css";

function Analytics() {

    const [branchSales, setBranchSales] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [leastProducts, setLeastProducts] = useState([]);
    const [dailySales, setDailySales] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const role = localStorage.getItem("role");
    const branchId = localStorage.getItem("branch_id");

    useEffect(() => {

        const loadAnalytics = async () => {

            try {

                setLoading(true);
                setError("");

                let branchQuery = "";

                // Branch users see only their branch
                if (role !== "SUPER_ADMIN" && branchId) {
                    branchQuery = `?branch_id=${branchId}`;
                }

                const [
                    branchSalesResponse,
                    topProductsResponse,
                    leastProductsResponse,
                    dailySalesResponse
                ] = await Promise.all([

                    axios.get(
                        "http://localhost:5000/api/analytics/branch-sales"
                    ),

                    axios.get(
                        `http://localhost:5000/api/analytics/top-products${branchQuery}`
                    ),

                    axios.get(
                        `http://localhost:5000/api/analytics/least-products${branchQuery}`
                    ),

                    axios.get(
                        `http://localhost:5000/api/analytics/daily-sales${branchQuery}`
                    )

                ]);

                setBranchSales(branchSalesResponse.data);
                setTopProducts(topProductsResponse.data);
                setLeastProducts(leastProductsResponse.data);
                setDailySales(dailySalesResponse.data);

            } catch (err) {

                console.error(
                    "Analytics Error:",
                    err
                );

                setError(
                    "Unable to load analytics data."
                );

            } finally {

                setLoading(false);

            }

        };

        loadAnalytics();

    }, [role, branchId]);


    if (loading) {

        return (
            <div className="analytics-container">

                <h1>📊 Sales Analytics</h1>

                <div className="analytics-message">
                    Loading real sales data...
                </div>

            </div>
        );

    }


    if (error) {

        return (
            <div className="analytics-container">

                <h1>📊 Sales Analytics</h1>

                <div className="analytics-error">
                    {error}
                </div>

            </div>
        );

    }


    return (

        <div className="analytics-container">

            <div className="analytics-header">

                <div>

                    <p>Business Analytics</p>

                    <h1>
                        📊 Sales Analytics
                    </h1>

                    <span>
                        Real sales data from your SuperMart database
                    </span>

                </div>

            </div>


            {/* =========================================
                BRANCH-WISE SALES
            ========================================= */}

            {role === "SUPER_ADMIN" && (

                <section className="analytics-card">

                    <div className="analytics-card-header">

                        <h2>
                            🏢 Branch-wise Sales
                        </h2>

                        <p>
                            Compare sales performance across branches
                        </p>

                    </div>

                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >

                            <BarChart
                                data={branchSales}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="branch_name"
                                />

                                <YAxis />

                                <Tooltip
                                    formatter={(value) =>
                                        `₹${Number(value).toLocaleString("en-IN")}`
                                    }
                                />

                                <Legend />

                                <Bar
                                    dataKey="total_sales"
                                    name="Total Sales"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </section>

            )}


            {/* =========================================
                TOP PRODUCTS
            ========================================= */}

            <section className="analytics-card">

                <div className="analytics-card-header">

                    <h2>
                        🏆 Top-selling Products
                    </h2>

                    <p>
                        Products with the highest quantity sold
                    </p>

                </div>

                <div className="chart-container">

                    <ResponsiveContainer
                        width="100%"
                        height={350}
                    >

                        <BarChart
                            data={topProducts}
                            layout="vertical"
                            margin={{
                                left: 40,
                                right: 20
                            }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                type="number"
                            />

                            <YAxis
                                type="category"
                                dataKey="product_name"
                                width={120}
                            />

                            <Tooltip />

                            <Legend />

                            <Bar
                                dataKey="quantity_sold"
                                name="Quantity Sold"
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </section>


            {/* =========================================
                LEAST PRODUCTS
            ========================================= */}

            <section className="analytics-card">

                <div className="analytics-card-header">

                    <h2>
                        📉 Least-selling Products
                    </h2>

                    <p>
                        Products with the lowest quantity sold
                    </p>

                </div>

                <div className="chart-container">

                    <ResponsiveContainer
                        width="100%"
                        height={350}
                    >

                        <BarChart
                            data={leastProducts}
                            layout="vertical"
                            margin={{
                                left: 40,
                                right: 20
                            }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                type="number"
                            />

                            <YAxis
                                type="category"
                                dataKey="product_name"
                                width={120}
                            />

                            <Tooltip />

                            <Legend />

                            <Bar
                                dataKey="quantity_sold"
                                name="Quantity Sold"
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </section>


            {/* =========================================
                DAILY SALES
            ========================================= */}

            <section className="analytics-card">

                <div className="analytics-card-header">

                    <h2>
                        📈 Daily Sales Trend
                    </h2>

                    <p>
                        Sales movement over time
                    </p>

                </div>

                <div className="chart-container">

                    <ResponsiveContainer
                        width="100%"
                        height={350}
                    >

                        <LineChart
                            data={dailySales}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="sale_date"
                            />

                            <YAxis />

                            <Tooltip
                                formatter={(value) =>
                                    `₹${Number(value).toLocaleString("en-IN")}`
                                }
                            />

                            <Legend />

                            <Line
                                type="monotone"
                                dataKey="total_sales"
                                name="Daily Sales"
                                strokeWidth={3}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </section>


        </div>

    );

}

export default Analytics;