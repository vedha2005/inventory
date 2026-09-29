import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/products.css";

const productImages = {
    biscuit: "Biscuit.png",
    biscuits: "Biscuit.png",
    bread: "Breads.png",
    butter: "Butter.png",
    "chana dal": "chanadal.png",
    cheese: "Cheese.png",
    "coffee powder": "Coffee_powder.png",
    "corn flakes": "Cone_flakes.png",
    "cooking oil": "cooking oil.png",
    curd: "Curd.png",
    detergent: "Detergent.png",
    dishwash: "dishwash.png",
    "dishwash liquid": "dishwash.png",
    eggs: "Eggs.png",
    "green tea": "Gree_tea.png",
    jam: "jam.png",
    ketchup: "ketchup.png",
    milk: "Milk.png",
    "moong dal": "moongdal.png",
    noodles: "Noodles.png",
    oats: "Oats.png",
    pasta: "pasta.png",
    "peanut butter": "Peanut_butter.png",
    rice: "Rice.png",
    salt: "Salt.png",
    shampoo: "shampoo.png",
    sugar: "sugar.png",
    tea: "Tea_powder.png",
    "tea powder": "Tea_powder.png",
    "tomato sauce": "Tomato_sauce.png",
    "toor dal": "Toor-dal.png",
    toothpaste: "Toothpaste.png",
    "wheat flour": "whole_wheat.png"
};

const branchNames = {
    1: "Chennai Branch",
    2: "Madurai Branch",
    3: "Trichy Branch"
};

const productImagePath = (productName) => {
    const normalizedName = String(productName || "")
        .toLowerCase()
        .replace(
            /\d+(?:\.\d+)?\s*(?:kg|g|ml|l|bags?|pack)\b/g,
            ""
        )
        .replace(/[^a-z]+/g, " ")
        .trim();

    const imageName = productImages[normalizedName];

    return imageName
        ? `/products/${imageName}`
        : "/product/image/product-placeholder.svg";
};

function Products() {
    // ==========================
    // User Role / Branch
    // ==========================

    const role = localStorage.getItem("role");
    const branchId = localStorage.getItem("branch_id");

    const isSuperAdmin = role === "SUPER_ADMIN";

    // ==========================
    // State
    // ==========================

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [stockFilter, setStockFilter] = useState("all");

    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    // For Super Admin
    const [selectedBranchId, setSelectedBranchId] = useState("");

    const productsPerPage = 8;

    // ==========================
    // Headers
    // ==========================

    const getHeaders = (includeSelectedBranch = false) => {
        const headers = {
            "x-role": role
        };

        // Branch user
        if (!isSuperAdmin && branchId) {
            headers["x-branch-id"] = branchId;
        }

        // Super Admin adding a product
        if (isSuperAdmin && includeSelectedBranch && selectedBranchId) {
            headers["x-branch-id"] = selectedBranchId;
        }

        return headers;
    };

    // ==========================
    // Get Products
    // ==========================

    const getProducts = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/products",
                {
                    headers: getHeaders()
                }
            );

            setProducts(res.data);
            setCurrentPage(1);
        } catch (err) {
            console.log("GET PRODUCTS ERROR:", err);

            alert(
                err.response?.data?.message ||
                "Failed to load products"
            );
        }
    };

    // ==========================
    // Load Products
    // ==========================

    useEffect(() => {
        getProducts();
    }, []);

    // ==========================
    // Filter Products
    // ==========================

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.product_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStock =
            stockFilter === "all" ||
            (
                stockFilter === "low" &&
                Number(product.quantity) <= 10
            ) ||
            (
                stockFilter === "available" &&
                Number(product.quantity) > 10
            );

        return matchesSearch && matchesStock;
    });

    // ==========================
    // Pagination
    // ==========================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredProducts.length / productsPerPage
        )
    );

    const visibleProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    // ==========================
    // Add / Update Product
    // ==========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Super Admin must select branch when adding
        if (
            isSuperAdmin &&
            !editingProduct &&
            !selectedBranchId
        ) {
            alert("Please select a branch");
            return;
        }

        try {
            const payload = {
                productName,
                price,
                quantity
            };

            let res;

            // ==========================
            // UPDATE
            // ==========================

            if (editingProduct) {
                res = await axios.put(
                    `http://localhost:5000/api/products/${editingProduct.id}`,
                    payload,
                    {
                        headers: getHeaders()
                    }
                );
            }

            // ==========================
            // ADD
            // ==========================

            else {
                res = await axios.post(
                    "http://localhost:5000/api/products",
                    payload,
                    {
                        headers: getHeaders(true)
                    }
                );
            }

            alert(res.data.message);

            setProductName("");
            setPrice("");
            setQuantity("");
            setSelectedBranchId("");

            setShowForm(false);
            setEditingProduct(null);

            getProducts();

        } catch (err) {
            console.log("PRODUCT SAVE ERROR:", err);

            alert(
                err.response?.data?.message ||
                "Failed to save product"
            );
        }
    };

    // ==========================
    // Edit Product
    // ==========================

    const editProduct = (product) => {
        setEditingProduct(product);

        setProductName(product.product_name);
        setPrice(product.price);
        setQuantity(product.quantity);

        // Show the product's branch to Super Admin
        if (isSuperAdmin) {
            setSelectedBranchId(
                String(product.branch_id)
            );
        }

        setShowForm(true);
    };

    // ==========================
    // Cancel Form
    // ==========================

    const cancelForm = () => {
        setShowForm(false);
        setEditingProduct(null);

        setProductName("");
        setPrice("");
        setQuantity("");

        setSelectedBranchId("");
    };

    // ==========================
    // Delete Product
    // ==========================

    const deleteProduct = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const res = await axios.delete(
                `http://localhost:5000/api/products/${id}`,
                {
                    headers: getHeaders()
                }
            );

            alert(res.data.message);

            getProducts();

        } catch (err) {
            console.log("DELETE PRODUCT ERROR:", err);

            alert(
                err.response?.data?.message ||
                "Failed to delete product"
            );
        }
    };

    // ==========================
    // UI
    // ==========================

    return (
        <div className="products-container">

            <h1>Product Management</h1>

            {/* ==========================
                Add Product Button
            ========================== */}

            {!showForm && (
                <button
                    className="add-btn"
                    onClick={() => {
                        setEditingProduct(null);
                        setSelectedBranchId("");
                        setShowForm(true);
                    }}
                >
                    ➕ Add Product
                </button>
            )}

            {/* ==========================
                Add / Edit Form
            ========================== */}

            {showForm && (
                <form
                    className="product-form"
                    onSubmit={handleSubmit}
                >

                    {/* Super Admin Branch Selection */}

                    {isSuperAdmin && (
                        <select
                            value={selectedBranchId}
                            onChange={(e) =>
                                setSelectedBranchId(
                                    e.target.value
                                )
                            }
                            required={!editingProduct}
                        >
                            <option value="">
                                Select Branch
                            </option>

                            <option value="1">
                                Chennai Branch
                            </option>

                            <option value="2">
                                Madurai Branch
                            </option>

                            <option value="3">
                                Trichy Branch
                            </option>
                        </select>
                    )}

                    <input
                        type="text"
                        placeholder="Product Name"
                        value={productName}
                        onChange={(e) =>
                            setProductName(e.target.value)
                        }
                        required
                    />

                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Price"
                        value={price}
                        onChange={(e) =>
                            setPrice(e.target.value)
                        }
                        required
                    />

                    <input
                        type="number"
                        min="0"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(e.target.value)
                        }
                        required
                    />

                    <div className="btn-group">

                        <button
                            type="submit"
                            className="save-btn"
                        >
                            {editingProduct
                                ? "Update Product"
                                : "Save Product"}
                        </button>

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={cancelForm}
                        >
                            Cancel
                        </button>

                    </div>

                </form>
            )}

            {/* ==========================
                Products Heading
            ========================== */}

            <h2>Added Products</h2>

            {/* ==========================
                Toolbar
            ========================== */}

            <div className="product-toolbar">

                <label className="search-field">

                    <span>Search products</span>

                    <input
                        type="search"
                        placeholder="Search by product name"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                </label>

                <label className="filter-field">

                    <span>Stock</span>

                    <select
                        value={stockFilter}
                        onChange={(e) => {
                            setStockFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >

                        <option value="all">
                            All products
                        </option>

                        <option value="available">
                            Available
                        </option>

                        <option value="low">
                            Low stock (10 or less)
                        </option>

                    </select>

                </label>

            </div>

            {/* ==========================
                Products Table
            ========================== */}

            <table className="products-table">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Image</th>

                        <th>Product Name</th>

                        <th>Price</th>

                        {isSuperAdmin && (
                            <th>Branch</th>
                        )}

                        <th>Stock Status</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {visibleProducts.map((product) => (

                        <tr key={product.id}>

                            <td>
                                {product.id}
                            </td>

                            <td>

                                <img
                                    className="product-thumb"
                                    src={productImagePath(
                                        product.product_name
                                    )}
                                    alt={
                                        product.product_name
                                    }
                                    onError={(event) => {
                                        event.currentTarget.onerror =
                                            null;

                                        event.currentTarget.src =
                                            "/product/image/product-placeholder.svg";
                                    }}
                                />

                            </td>

                            <td>
                                {product.product_name}
                            </td>

                            <td>
                                ₹{product.price}
                            </td>

                            {/* Branch visible only to Super Admin */}

                            {isSuperAdmin && (
                                <td>
                                    {branchNames[
                                        product.branch_id
                                    ] || "Unknown Branch"}
                                </td>
                            )}

                            <td>

                                <span
                                    className={`stock-status ${
                                        Number(
                                            product.quantity
                                        ) <= 10
                                            ? "low"
                                            : "available"
                                    }`}
                                >

                                    {product.quantity}{" "}

                                    {Number(
                                        product.quantity
                                    ) <= 10
                                        ? "Low stock"
                                        : "In stock"}

                                </span>

                            </td>

                            <td>

                                <button
                                    className="view-btn"
                                    onClick={() =>
                                        setViewingProduct(
                                            product
                                        )
                                    }
                                >
                                    View
                                </button>

                                <button
                                    className="edit-btn"
                                    onClick={() =>
                                        editProduct(product)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        deleteProduct(
                                            product.id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                    {filteredProducts.length === 0 && (

                        <tr>

                            <td
                                className="table-message"
                                colSpan={
                                    isSuperAdmin
                                        ? "7"
                                        : "6"
                                }
                            >
                                No matching products found.
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

            {/* ==========================
                Pagination
            ========================== */}

            {filteredProducts.length > 0 && (

                <div
                    className="pagination"
                    aria-label="Product list pages"
                >

                    <button
                        type="button"
                        onClick={() =>
                            setCurrentPage(
                                currentPage - 1
                            )
                        }
                        disabled={
                            currentPage === 1
                        }
                    >
                        &larr; Back
                    </button>

                    <span>
                        Page {currentPage} of{" "}
                        {totalPages}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setCurrentPage(
                                currentPage + 1
                            )
                        }
                        disabled={
                            currentPage === totalPages
                        }
                    >
                        Next &rarr;
                    </button>

                </div>

            )}

            {/* ==========================
                View Product Modal
            ========================== */}

            {viewingProduct && (

                <div
                    className="product-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Product details"
                >

                    <div className="product-modal-content">

                        <button
                            className="modal-close"
                            onClick={() =>
                                setViewingProduct(null)
                            }
                            aria-label="Close product details"
                        >
                            &times;
                        </button>

                        <img
                            className="modal-product-image"
                            src={productImagePath(
                                viewingProduct.product_name
                            )}
                            alt={
                                viewingProduct.product_name
                            }
                        />

                        <p className="product-id-label">
                            Product ID #
                            {viewingProduct.id}
                        </p>

                        <h2>
                            {viewingProduct.product_name}
                        </h2>

                        <p>
                            Price: ₹
                            {viewingProduct.price}
                        </p>

                        <p>
                            Quantity:{" "}
                            {viewingProduct.quantity}
                        </p>

                        {isSuperAdmin && (
                            <p>
                                Branch:{" "}
                                {branchNames[
                                    viewingProduct.branch_id
                                ] || "Unknown Branch"}
                            </p>
                        )}

                        <span
                            className={`stock-status ${
                                Number(
                                    viewingProduct.quantity
                                ) <= 10
                                    ? "low"
                                    : "available"
                            }`}
                        >

                            {Number(
                                viewingProduct.quantity
                            ) <= 10
                                ? "Low stock"
                                : "In stock"}

                        </span>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Products;