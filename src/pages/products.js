import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/products.css";

function Products() {

    const [showForm, setShowForm] = useState(false);

    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");

    const [products, setProducts] = useState([]);

    // Get products from MySQL
    const getProducts = async () => {

        try {

            const res = await axios.get(
                "http://localhost:5000/api/products"
            );

            setProducts(res.data);

        } catch (err) {

            console.log(err);
            alert("Failed to load products");

        }

    };

    // Load products when page opens
    useEffect(() => {
        getProducts();
    }, []);

    // Add product
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                "http://localhost:5000/api/products",
                {
                    productName,
                    price,
                    quantity
                }
            );

            alert(res.data.message);

            setProductName("");
            setPrice("");
            setQuantity("");
            setShowForm(false);

            // Refresh product list
            getProducts();

        } catch (err) {

            console.log(err);
            alert("Failed to add product");

        }

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
                    onClick={() => setShowForm(true)}
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
                            Save Product
                        </button>

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            )}

            <h2>Added Products</h2>

            <table className="products-table">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>

                    {products.map((product) => (

                        <tr key={product.id}>

                            <td>{product.id}</td>

                            <td>{product.product_name}</td>

                            <td>₹{product.price}</td>

                            <td>{product.quantity}</td>

                            <td>

                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        deleteProduct(product.id)
                                    }
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default Products;