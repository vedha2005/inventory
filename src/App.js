import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Navbar from "./components/navbar";

import Login from "./pages/login";
import Admin from "./pages/admin";
import Products from "./pages/products";
import Cart from "./pages/cart";
import Customers from "./pages/customers";
import SalesPrediction from "./pages/salesprediction";
import Analytics from "./pages/analytics";
// =========================================================
// PROTECTED ROUTE
// =========================================================

function ProtectedRoute({ children }) {

    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true";

    return isLoggedIn
        ? children
        : <Navigate to="/" replace />;
}


// =========================================================
// APP
// =========================================================

function App() {

    return (

        <BrowserRouter>

            {/* =================================================
                NAVBAR
                Previous / Next + Logout
               ================================================= */}

            <Navbar />


            {/* =================================================
                ROUTES
               ================================================= */}

            <Routes>

                {/* =================================================
                    LOGIN
                   ================================================= */}

                <Route
                    path="/"
                    element={<Login />}
                />


                {/* =================================================
                    DASHBOARD
                   ================================================= */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    PRODUCTS
                   ================================================= */}

                <Route
                    path="/products"
                    element={
                        <ProtectedRoute>
                            <Products />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    CUSTOMERS
                   ================================================= */}

                <Route
                    path="/customers"
                    element={
                        <ProtectedRoute>
                            <Customers />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    BILLING
                   ================================================= */}

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    ANALYTICS
                   ================================================= */}

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    SALES PREDICTION
                   ================================================= */}

                <Route
                    path="/sales-prediction"
                    element={
                        <ProtectedRoute>
                            <SalesPrediction />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    UNKNOWN URL
                   ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;