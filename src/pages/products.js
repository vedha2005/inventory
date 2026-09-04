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

const productImagePath = (productName) => {
    const normalizedName = String(productName || "")
        .toLowerCase()
        .replace(/\d+(?:\.\d+)?\s*(?:kg|g|ml|l|bags?|pack)\b/g, "")
        .replace(/[^a-z]+/g, " ")
        .trim();
    const imageName = productImages[normalizedName];

    return imageName ? `/products/${imageName}` : "/product/image/product-placeholder.svg";
};

function Products() {

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
    const productsPerPage = 8;

    // Get products from MySQL
    const getProducts = async () => {

        try {

            const res = await axios.get(
                "http://localhost:5000/api/products"
            );

            setProducts(res.data);
            setCurrentPage(1);

        } catch (err) {

            console.log(err);
            alert("Failed to load products");

        }

    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.product_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStock = stockFilter === "all"
            || (stockFilter === "low" && Number(product.quantity) <= 10)
            || (stockFilter === "available" && Number(product.quantity) > 10);

        return matchesSearch && matchesStock;
    });
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
    const visibleProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    // Load products when page opens
    useEffect(() => {
        getProducts();
    }, []);

    // Add product
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const payload = { productName, price, quantity };
            const res = editingProduct
                ? await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, payload)
                : await axios.post("http://localhost:5000/api/products", payload);

            alert(res.data.message);

            setProductName("");
            setPrice("");
            setQuantity("");
            setShowForm(false);
            setEditingProduct(null);

            // Refresh product list
            getProducts();

        } catch (err) {

            console.log(err);
            alert("Failed to add product");

        }

    };

    const editProduct = (product) => {
        setEditingProduct(product);
        setProductName(product.product_name);
        setPrice(product.price);
        setQuantity(product.quantity);
        setShowForm(true);
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setProductName("");
        setPrice("");
        setQuantity("");
    };

    // Delete product
    const deleteProduct = async (id) => {

        try {

            const res = await axios.delete(
                `http://localhost:5000/api/products/${id}`
            );

            alert(res.data.message);

            getProducts();

        } catch (err) {

            console.log(err);
            alert("Failed to delete product");

        }

    };

    return (

        <div className="products-container">

            <h1>Product Management</h1>

            {!showForm && (

                <button
                    className="add-btn"
                    onClick={() => {
                        setEditingProduct(null);
                        setShowForm(true);
                    }}
                >
                    ➕ Add Product
                </button>

            )}

            {showForm && (

                <form
                    className="product-form"
                    onSubmit={handleSubmit}
                >

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
                        placeholder="Price"
                        value={price}
                        onChange={(e) =>
                            setPrice(e.target.value)
                        }
                        required
                    />

                    <input
                        type="number"
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
                            {editingProduct ? "Update Product" : "Save Product"}
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

            <h2>Added Products</h2>

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
                    <select value={stockFilter} onChange={(e) => {
                        setStockFilter(e.target.value);
                        setCurrentPage(1);
                    }}>
                        <option value="all">All products</option>
                        <option value="available">Available</option>
                        <option value="low">Low stock (10 or less)</option>
                    </select>
                </label>
            </div>

            <table className="products-table">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Price</th>
                            <th>Stock Status</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>

                    {visibleProducts.map((product) => (

                        <tr key={product.id}>

                            <td>{product.id}</td>

                            <td>
                                <img
                                    className="product-thumb"
                                    src={productImagePath(product.product_name)}
                                    alt={product.product_name}
                                    onError={(event) => {
                                        event.currentTarget.onerror = null;
                                        event.currentTarget.src = "/product/image/product-placeholder.svg";
                                    }}
                                />
                            </td>

                            <td>{product.product_name}</td>

                            <td>₹{product.price}</td>

                            <td>
                                <span className={`stock-status ${Number(product.quantity) <= 10 ? "low" : "available"}`}>
                                    {product.quantity} {Number(product.quantity) <= 10 ? "Low stock" : "In stock"}
                                </span>
                            </td>

                            <td>

                                <button
                                    className="view-btn"
                                    onClick={() => setViewingProduct(product)}
                                >
                                    View
                                </button>
                                <button className="edit-btn" onClick={() => editProduct(product)}>
                                    Edit
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => deleteProduct(product.id)}
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                    {filteredProducts.length === 0 && (
                        <tr>
                            <td className="table-message" colSpan="6">No matching products found.</td>
                        </tr>
                    )}

                </tbody>

            </table>

            {filteredProducts.length > 0 && (
                <div className="pagination" aria-label="Product list pages">
                    <button type="button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&larr; Back</button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button type="button" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next &rarr;</button>
                </div>
            )}

            {viewingProduct && (
                <div className="product-modal" role="dialog" aria-modal="true" aria-label="Product details">
                    <div className="product-modal-content">
                        <button className="modal-close" onClick={() => setViewingProduct(null)} aria-label="Close product details">&times;</button>
                        <img className="modal-product-image" src={productImagePath(viewingProduct.product_name)} alt={viewingProduct.product_name} />
                        <p className="product-id-label">Product ID #{viewingProduct.id}</p>
                        <h2>{viewingProduct.product_name}</h2>
                        <p>Price: ₹{viewingProduct.price}</p>
                        <p>Quantity: {viewingProduct.quantity}</p>
                        <span className={`stock-status ${Number(viewingProduct.quantity) <= 10 ? "low" : "available"}`}>
                            {Number(viewingProduct.quantity) <= 10 ? "Low stock" : "In stock"}
                        </span>
                    </div>
                </div>
            )}

        </div>

    );

}

export default Products;