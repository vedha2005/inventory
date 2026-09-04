import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/admin.css";

function Admin() {

    const [productCount, setProductCount] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);
    const [lowStockProducts, setLowStockProducts] = useState([]);

    useEffect(() => {

        // Get Dashboard Counts
        axios.get("http://localhost:5000/api/dashboard")
            .then((response) => {

                setProductCount(response.data.totalProducts);
                setCustomerCount(response.data.totalCustomers);

            })
            .catch((error) => {

                console.log("Dashboard Error:", error);

            });


        // Get Low Stock Products
        axios.get("http://localhost:5000/api/dashboard/low-stock")
            .then((response) => {

                setLowStockProducts(response.data.products);

            })
            .catch((error) => {

                console.log("Low Stock Error:", error);

            });

    }, []);


    return (

        <div className="admin-container">

            {/* Dashboard */}

            <h1>SuperMart Dashboard</h1>
            <nav className="dashboard-nav" aria-label="Dashboard navigation">
                <Link to="/products">Products</Link>
                <Link to="/customers">Customers</Link>
                <Link to="/cart">New Bill</Link>
            </nav>


            <div className="dashboard-cards">

                {/* Products */}

                <div className="dashboard-card">

                    <div className="card-icon">
                        🛒
                    </div>

                    <div>

                        <h2>{productCount}</h2>

                        <p>Total Products</p>

                    </div>

                </div>


                {/* Customers */}

                <div className="dashboard-card">

                    <div className="card-icon">
                        👥
                    </div>

                    <div>

                        <h2>{customerCount}</h2>

                        <p>Total Customers</p>

                    </div>

                </div>

            </div>


            {/* Low Stock Alert */}

            <div className="low-stock-alert">

                <h2>⚠ Low Stock Alert</h2>

                {lowStockProducts.length === 0 ? (

                    <p>✅ All products have sufficient stock.</p>

                ) : (

                    <table>

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product Name</th>
                                <th>Quantity Left</th>
                            </tr>
                        </thead>

                        <tbody>

                            {lowStockProducts.map((product) => (

                                <tr key={product.id}>

                                    <td>{product.id}</td>

                                    <td>{product.product_name}</td>

                                    <td>
                                        ⚠ {product.quantity} left
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

            <section className="stock-chart" aria-labelledby="stock-chart-title">
                <div className="section-heading">
                    <div>
                        <p className="section-kicker">Inventory health</p>
                        <h2 id="stock-chart-title">Low-stock overview</h2>
                    </div>
                    <span className="chart-unit">Units left</span>
                </div>

                {lowStockProducts.length === 0 ? (
                    <p className="chart-empty">No low-stock products to chart.</p>
                ) : (
                    <div className="stock-bars">
                        {lowStockProducts.map((product) => {
                            const maximumStock = Math.max(
                                ...lowStockProducts.map(item => Number(item.quantity)),
                                10
                            );
                            const barWidth = Math.max(
                                (Number(product.quantity) / maximumStock) * 100,
                                6
                            );

                            return (
                                <div className="stock-bar-row" key={product.id}>
                                    <span className="stock-bar-label">{product.product_name}</span>
                                    <div className="stock-bar-track">
                                        <span className="stock-bar-fill" style={{ width: `${barWidth}%` }} />
                                    </div>
                                    <strong>{product.quantity}</strong>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

        </div>

    );

}

export default Admin;