import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Home from "./pages/home";
import Products from "./pages/products";
import Cart from "./pages/cart";
import Admin from "./pages/admin";
import Customers from "./pages/customers";
import Navbar from "./components/navbar";

function ProtectedRoute({ children }) {

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        return children;
    } else {
        return <Navigate to="/" />;
    }

}

function ProtectedLayout({ children }) {
    return (
        <div className="app-shell">
            <Navbar />
            <main className="page-content">{children}</main>
        </div>
    );
}

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Login */}
                <Route path="/" element={<Login />} />

                {/* Dashboard */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <ProtectedLayout><Admin /></ProtectedLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Home */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <ProtectedLayout><Home /></ProtectedLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Products */}
                <Route
                    path="/products"
                    element={
                        <ProtectedRoute>
                            <ProtectedLayout><Products /></ProtectedLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Customers */}
                <Route
                    path="/customers"
                    element={
                        <ProtectedRoute>
                            <ProtectedLayout><Customers /></ProtectedLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Billing */}
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <ProtectedLayout><Cart /></ProtectedLayout>
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;