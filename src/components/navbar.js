import "../css/navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const pages = [
        "/admin",
        "/products",
        "/customers",
        "/cart",
        "/analytics",
        "/sales-prediction"
    ];

    const currentPage = pages.indexOf(location.pathname);

    // =========================================================
    // LOGIN PAGE
    // Only show S SuperMart logo
    // =========================================================

    if (location.pathname === "/") {
        return (
            <nav className="navbar login-navbar">

                <Link className="logo" to="/">
                    <span className="logo-mark">S</span>
                    Super<span>Mart</span>
                </Link>

            </nav>
        );
    }

    // =========================================================
    // LOGOUT
    // =========================================================

    const logout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/");
    };

    // =========================================================
    // PREVIOUS
    // =========================================================

    const goBack = () => {
        if (currentPage > 0) {
            navigate(pages[currentPage - 1]);
        }
    };

    // =========================================================
    // NEXT
    // =========================================================

    const goNext = () => {
        if (
            currentPage >= 0 &&
            currentPage < pages.length - 1
        ) {
            navigate(pages[currentPage + 1]);
        }
    };

    return (
        <>
            {/* =================================================
                MAIN NAVBAR
               ================================================= */}

            <nav className="navbar">

                {/* LOGO */}

                <Link className="logo" to="/admin">
                    <span className="logo-mark">S</span>
                    Super<span>Mart</span>
                </Link>


                {/* NAVIGATION */}

                <ul className="nav-links">

                    <li>
                        <Link
                            to="/admin"
                            className={
                                location.pathname === "/admin"
                                    ? "active"
                                    : ""
                            }
                        >
                            Dashboard
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/products"
                            className={
                                location.pathname === "/products"
                                    ? "active"
                                    : ""
                            }
                        >
                            Products
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/customers"
                            className={
                                location.pathname === "/customers"
                                    ? "active"
                                    : ""
                            }
                        >
                            Customers
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/cart"
                            className={
                                location.pathname === "/cart"
                                    ? "active"
                                    : ""
                            }
                        >
                            New Bill
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/analytics"
                            className={
                                location.pathname === "/analytics"
                                    ? "active"
                                    : ""
                            }
                        >
                            📊 Analytics
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/sales-prediction"
                            className={
                                location.pathname === "/sales-prediction"
                                    ? "active"
                                    : ""
                            }
                        >
                            📈 Sales Prediction
                        </Link>
                    </li>


                    {/* LOGOUT - ADMIN ONLY */}

                    {location.pathname === "/admin" && (
                        <li>
                            <button
                                type="button"
                                className="logout-btn"
                                onClick={logout}
                            >
                                <span className="logout-icon">
                                    
                                </span>

                                <span>
                                    Logout
                                </span>
                            </button>
                        </li>
                    )}

                </ul>

            </nav>


            {/* =================================================
                PREVIOUS / NEXT
               ================================================= */}

            <div className="page-nav">

                <button
                    type="button"
                    className="page-nav-button back-button"
                    onClick={goBack}
                    disabled={currentPage <= 0}
                    aria-label="Previous page"
                >
                    <span className="nav-arrow">
                        ←
                    </span>

                    <span className="nav-text">
                        Previous
                    </span>
                </button>


                <button
                    type="button"
                    className="page-nav-button next-button"
                    onClick={goNext}
                    disabled={
                        currentPage === -1 ||
                        currentPage >= pages.length - 1
                    }
                    aria-label="Next page"
                >
                    <span className="nav-arrow">
                        →
                    </span>

                    <span className="nav-text">
                        Next
                    </span>
                </button>

            </div>
        </>
    );
}

export default Navbar;