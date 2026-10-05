import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/admin.css";

function Admin() {
    const [productCount, setProductCount] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);
    const [lowStockProducts, setLowStockProducts] = useState([]);

    // Logged-in user information
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const branchId = localStorage.getItem("branch_id");

    const [branchName, setBranchName] = useState("");

    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    useEffect(() => {
        let dashboardUrl =
            "http://localhost:5000/api/dashboard";

        let lowStockUrl =
            "http://localhost:5000/api/dashboard/low-stock";

        // =================================================
        // ADD USER INFORMATION
        // =================================================

        if (role === "SUPER_ADMIN") {
            dashboardUrl += "?role=SUPER_ADMIN";
            lowStockUrl += "?role=SUPER_ADMIN";
        } else {
            dashboardUrl +=
                `?branch_id=${branchId}&role=${role}`;

            lowStockUrl +=
                `?branch_id=${branchId}&role=${role}`;
        }

        console.log(
            "Dashboard URL:",
            dashboardUrl
        );

        console.log(
            "Low Stock URL:",
            lowStockUrl
        );

        // =================================================
        // GET DASHBOARD COUNTS
        // =================================================

        axios
            .get(dashboardUrl)
            .then((response) => {
                console.log(
                    "Dashboard Response:",
                    response.data
                );

                setProductCount(
                    response.data.totalProducts
                );

                setCustomerCount(
                    response.data.totalCustomers
                );
            })
            .catch((error) => {
                console.log(
                    "Dashboard Error:",
                    error
                );
            });

        // =================================================
        // GET LOW STOCK PRODUCTS
        // =================================================

        axios
            .get(lowStockUrl)
            .then((response) => {
                console.log(
                    "Low Stock Response:",
                    response.data
                );

                setLowStockProducts(
                    response.data.products || []
                );
            })
            .catch((error) => {
                console.log(
                    "Low Stock Error:",
                    error
                );
            });

        // =================================================
        // GET BRANCH NAME
        // =================================================

        if (
            role !== "SUPER_ADMIN" &&
            branchId
        ) {
            axios
                .get(
                    `http://localhost:5000/api/branches/${branchId}`
                )
                .then((response) => {
                    setBranchName(
                        response.data.branch_name
                    );
                })
                .catch((error) => {
                    console.log(
                        "Branch Error:",
                        error
                    );
                });
        }
    }, [branchId, role]);

    // =====================================================
    // MAXIMUM STOCK FOR CHART
    // =====================================================

    const maximumStock = Math.max(
        ...lowStockProducts.map(
            (product) =>
                Number(product.quantity)
        ),
        10
    );

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="admin-container">

            {/* =================================================
                DASHBOARD HEADER
            ================================================= */}

            <div className="dashboard-header">

                <div>

                    <h1>
                        SuperMart Dashboard
                    </h1>

                    <p>
                        Welcome back,{" "}
                        <strong>
                            {username}
                        </strong>{" "}
                        👋
                    </p>

                </div>


                {/* USER INFORMATION */}

                <div className="user-info">

                    <p>
                        👤{" "}
                        <strong>
                            {username}
                        </strong>
                    </p>

                    <p>
                        🏷️ Role:{" "}
                        <strong>
                            {role === "SUPER_ADMIN"
                                ? "Super Admin"
                                : "Branch User"}
                        </strong>
                    </p>

                    <p>
                        🏢 Branch:{" "}
                        <strong>
                            {role === "SUPER_ADMIN"
                                ? "All Branches"
                                : branchName ||
                                  `Branch ${branchId}`}
                        </strong>
                    </p>

                </div>

            </div>


            {/* =================================================
                QUICK NAVIGATION
            ================================================= */}

            <nav
                className="dashboard-nav"
                aria-label="Dashboard navigation"
            >

                <div className="dashboard-nav-title">
                </div>


                <div className="dashboard-nav-buttons">

                    {/* PRODUCTS */}

                    <Link
                        to="/products"
                        className="dashboard-nav-button"
                    >
                        <span>🛒</span>
                        <span>Products</span>
                    </Link>


                    {/* CUSTOMERS */}

                    <Link
                        to="/customers"
                        className="dashboard-nav-button"
                    >
                        <span>👥</span>
                        <span>Customers</span>
                    </Link>


                    {/* NEW BILL */}

                    <Link
                        to="/cart"
                        className="dashboard-nav-button"
                    >
                        <span>🧾</span>
                        <span>New Bill</span>
                    </Link>


                    {/* ANALYTICS */}

                    <Link
                        to="/analytics"
                        className="dashboard-nav-button"
                    >
                        <span>📊</span>
                        <span>Analytics</span>
                    </Link>


                    {/* SALES PREDICTION */}

                    <Link
                        to="/sales-prediction"
                        className="dashboard-nav-button"
                    >
                        <span>📈</span>
                        <span>Sales Prediction</span>
                    </Link>


                    {/* EOD REPORTS */}

                    <Link
                        to="/eod-reports"
                        className="dashboard-nav-button"
                    >
                        <span>📄</span>
                        <span>EOD Reports</span>
                    </Link>

                </div>

            </nav>


            {/* =================================================
                DASHBOARD CARDS
            ================================================= */}

            <div className="dashboard-cards">

                {/* PRODUCTS */}

                <div className="dashboard-card">

                    <div className="card-icon">
                        🛒
                    </div>

                    <div>

                        <h2>
                            {productCount}
                        </h2>

                        <p>
                            Total Products
                        </p>

                    </div>

                </div>


                {/* CUSTOMERS */}

                <div className="dashboard-card">

                    <div className="card-icon">
                        👥
                    </div>

                    <div>

                        <h2>
                            {customerCount}
                        </h2>

                        <p>
                            Total Customers
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                LOW STOCK ALERT
            ================================================= */}

            <div className="low-stock-alert">

                <h2>
                    ⚠ Low Stock Alert
                </h2>


                {lowStockProducts.length === 0 ? (

                    <p>
                        ✅ All products have sufficient stock.
                    </p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Product Name
                                </th>


                                {/* SHOW BRANCH ONLY FOR SUPER ADMIN */}

                                {role === "SUPER_ADMIN" && (
                                    <th>
                                        Branch
                                    </th>
                                )}

                                <th>
                                    Quantity Left
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {lowStockProducts.map(
                                (product) => (

                                    <tr
                                        key={`${product.id}-${product.branch_id}`}
                                    >

                                        <td>
                                            {product.id}
                                        </td>

                                        <td>
                                            {product.product_name}
                                        </td>


                                        {/* BRANCH NAME */}

                                        {role === "SUPER_ADMIN" && (
                                            <td>
                                                {product.branch_name}
                                            </td>
                                        )}


                                        <td>
                                            ⚠{" "}
                                            {product.quantity}{" "}
                                            left
                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>


            {/* =================================================
                STOCK CHART
            ================================================= */}

            <section
                className="stock-chart"
                aria-labelledby="stock-chart-title"
            >

                <div className="section-heading">

                    <div>

                        <p className="section-kicker">
                            Inventory health
                        </p>

                        <h2 id="stock-chart-title">
                            Low-stock overview
                        </h2>

                    </div>

                    <span className="chart-unit">
                        Units left
                    </span>

                </div>


                {lowStockProducts.length === 0 ? (

                    <p className="chart-empty">
                        No low-stock products to chart.
                    </p>

                ) : (

                    <div className="stock-bars">

                        {lowStockProducts.map(
                            (product) => {

                                const barWidth =
                                    Math.max(
                                        (
                                            Number(
                                                product.quantity
                                            ) /
                                            maximumStock
                                        ) * 100,
                                        6
                                    );

                                return (

                                    <div
                                        className="stock-bar-row"
                                        key={`${product.id}-${product.branch_id}-chart`}
                                    >

                                        <span className="stock-bar-label">

                                            {role === "SUPER_ADMIN"
                                                ? `${product.product_name} - ${product.branch_name}`
                                                : product.product_name}

                                        </span>


                                        <div className="stock-bar-track">

                                            <span
                                                className="stock-bar-fill"
                                                style={{
                                                    width: `${barWidth}%`
                                                }}
                                            />

                                        </div>


                                        <strong>
                                            {product.quantity}
                                        </strong>

                                    </div>

                                );
                            }
                        )}

                    </div>

                )}

            </section>

        </div>
    );
}

export default Admin;