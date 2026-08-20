import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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

            {/* Navigation */}

            <nav className="dashboard-nav">

                <h2>🛒 SuperMart</h2>

                <div className="nav-buttons">

                    <Link to="/admin">
                        Dashboard
                    </Link>

                    <Link to="/products">
                        Products
                    </Link>

                    <Link to="/customers">
                        Customers
                    </Link>

                    <Link to="/cart">
                        Billing
                    </Link>

                    <button
                        onClick={() => {

                            localStorage.removeItem("isLoggedIn");

                            window.location.href = "/";

                        }}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* Dashboard */}

            <h1>SuperMart Dashboard</h1>


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

        </div>

    );

}

export default Admin;