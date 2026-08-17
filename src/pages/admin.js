import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/admin.css";

function Admin() {

    const [productCount, setProductCount] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);

    useEffect(() => {

        axios.get("http://localhost:5000/api/dashboard")
            .then((response) => {

                setProductCount(
                    response.data.totalProducts
                );

                setCustomerCount(
                    response.data.totalCustomers
                );

            })
            .catch((error) => {

                console.log("Dashboard Error:", error);

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

                            localStorage.removeItem(
                                "isLoggedIn"
                            );

                            window.location.href = "/";

                        }}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* Dashboard */}

            <h1>
                SuperMart Dashboard
            </h1>


            <div className="dashboard-cards">

                {/* Products */}

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


                {/* Customers */}

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

        </div>

    );

}

export default Admin;