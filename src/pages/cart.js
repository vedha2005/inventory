import React, { useEffect, useState } from "react";
import "../css/productcart.css";

function Cart() {

    const [customers, setCustomers] = useState([]);
    const [customerSearch, setCustomerSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [productId, setProductId] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [billItems, setBillItems] = useState([]);
    const [paidAmount, setPaidAmount] = useState("");

    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {

        loadCustomers();
        loadProducts();
        updateDateTime();

        const timer = setInterval(() => {
            updateDateTime();
        }, 1000);

        return () => clearInterval(timer);

    }, []);

    // =========================
    // DATE & TIME
    // =========================

    const updateDateTime = () => {

        const now = new Date();

        setCurrentDate(
            now.toLocaleDateString("en-IN")
        );

        setCurrentTime(
            now.toLocaleTimeString("en-IN")
        );
    };

    // =========================
    // LOAD CUSTOMERS
    // =========================

    const loadCustomers = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/customers"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load customers"
                );
            }

            setCustomers(data);

        } catch (error) {

            console.log("CUSTOMER ERROR:", error);

            alert("Failed to load customers");
        }
    };

    // =========================
    // LOAD PRODUCTS
    // =========================

    const loadProducts = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/products"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load products"
                );
            }

            // Only active products
            const activeProducts = data.filter(
                product =>
                    product.is_active === 1 ||
                    product.is_active === true
            );

            setProducts(activeProducts);

        } catch (error) {

            console.log("PRODUCT ERROR:", error);

            alert("Failed to load products");
        }
    };

    // =========================
    // SEARCH CUSTOMER
    // =========================

    const filteredCustomers = customers.filter(customer => {

        const name = customer.customer_name || "";

        return name
            .toLowerCase()
            .includes(customerSearch.toLowerCase());

    });

    // =========================
    // SELECT CUSTOMER
    // =========================

    const selectCustomer = (customer) => {

        setSelectedCustomer(customer);

        setCustomerSearch(
            customer.customer_name
        );
    };

    // =========================
    // PRODUCT CHANGE
    // =========================

    const handleProductChange = (e) => {

        const id = e.target.value;

        setSelectedProduct(id);

        const product = products.find(
            item =>
                String(item.id) === String(id)
        );

        if (product) {

            setProductId(product.id);
            setPrice(product.price);
            setQuantity(1);

        } else {

            setProductId("");
            setPrice("");
            setQuantity(1);
        }
    };

    // =========================
    // ADD PRODUCT
    // =========================

    const addProduct = () => {

        if (!selectedProduct) {

            alert("Please select a product");
            return;
        }

        if (!quantity || Number(quantity) <= 0) {

            alert("Please enter a valid quantity");
            return;
        }

        const product = products.find(
            item =>
                String(item.id) === String(selectedProduct)
        );

        if (!product) {

            alert("Product not found");
            return;
        }

        if (Number(quantity) > Number(product.quantity)) {

            alert(
                `Only ${product.quantity} items available`
            );

            return;
        }

        const itemTotal =
            Number(product.price) *
            Number(quantity);

        const newItem = {

            productId: product.id,

            productName: product.product_name,

            price: Number(product.price),

            quantity: Number(quantity),

            total: itemTotal
        };

        setBillItems([
            ...billItems,
            newItem
        ]);

        setSelectedProduct("");
        setProductId("");
        setPrice("");
        setQuantity(1);
    };

    // =========================
    // DELETE BILL ITEM
    // =========================

    const deleteItem = (index) => {

        setBillItems(
            billItems.filter(
                (_, i) => i !== index
            )
        );
    };

    // =========================
    // TOTAL
    // =========================

    const total = billItems.reduce(
        (sum, item) =>
            sum + Number(item.total),
        0
    );

    // =========================
    // RETURN AMOUNT
    // =========================

    const returnAmount =
        Number(paidAmount || 0) - total;

    // =========================
    // SAVE BILL
    // =========================

    const saveBill = async () => {

        if (!selectedCustomer) {

            alert("Please select a customer");
            return;
        }

        if (billItems.length === 0) {

            alert("Please add at least one product");
            return;
        }

        if (
            paidAmount === "" ||
            Number(paidAmount) < total
        ) {

            alert(
                `Paid amount must be at least ₹${total.toFixed(2)}`
            );

            return;
        }

        const billData = {

            customerId:
                selectedCustomer.customer_id,

            total: total,

            paidAmount:
                Number(paidAmount),

            returnAmount:
                Number(returnAmount),

            items: billItems.map(item => ({

                productId: item.productId,

                quantity: item.quantity,

                price: item.price
            }))
        };

        try {

            const response = await fetch(
                "http://localhost:5000/api/billing",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(billData)
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to save bill"
                );
            }

            alert(
                `Bill saved successfully!\nBill ID: ${data.billId}`
            );

            // Automatically clear bill
            setSelectedCustomer(null);
            setCustomerSearch("");

            setSelectedProduct("");
            setProductId("");
            setPrice("");
            setQuantity(1);

            setBillItems([]);

            setPaidAmount("");

            loadProducts();

        } catch (error) {

            console.log("SAVE BILL ERROR:", error);

            alert(
                "Failed to save bill: " +
                error.message
            );
        }
    };

    // =========================
    // UI
    // =========================

    return (

        <div className="billing-container">

            {/* HEADER */}

            <div className="billing-header">

                <h1>🧾 Billing</h1>

                <div className="date-time">

                    <div>
                        <b>Date:</b> {currentDate}
                    </div>

                    <div>
                        <b>Time:</b> {currentTime}
                    </div>

                </div>

            </div>


            {/* CUSTOMER DETAILS */}

            <div className="billing-section">

                <h2>Customer Details</h2>

                <div className="customer-grid">

                    <div className="form-group customer-search">

                        <label>
                            Search Customer:
                        </label>

                        <input
                            type="text"
                            placeholder="Search customer by name"
                            value={customerSearch}
                            onChange={(e) => {

                                setCustomerSearch(
                                    e.target.value
                                );

                                setSelectedCustomer(null);
                            }}
                        />

                        {customerSearch &&
                            !selectedCustomer &&
                            filteredCustomers.length > 0 && (

                                <div className="customer-dropdown">

                                    {filteredCustomers.map(
                                        customer => (

                                            <div
                                                key={
                                                    customer.customer_id
                                                }
                                                className="customer-option"
                                                onClick={() =>
                                                    selectCustomer(
                                                        customer
                                                    )
                                                }
                                            >

                                                <b>
                                                    {
                                                        customer.customer_name
                                                    }
                                                </b>

                                                <br />

                                                <span>
                                                    {
                                                        customer.phone
                                                    }
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>
                            )}

                    </div>


                    <div className="form-group">

                        <label>
                            Customer Name:
                        </label>

                        <input
                            type="text"
                            value={
                                selectedCustomer
                                    ? selectedCustomer.customer_name
                                    : ""
                            }
                            readOnly
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Email:
                        </label>

                        <input
                            type="text"
                            value={
                                selectedCustomer
                                    ? selectedCustomer.email || ""
                                    : ""
                            }
                            readOnly
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Address:
                        </label>

                        <input
                            type="text"
                            value={
                                selectedCustomer
                                    ? selectedCustomer.address || ""
                                    : ""
                            }
                            readOnly
                        />

                    </div>

                </div>

            </div>


            {/* PRODUCT DETAILS */}

            <div className="billing-section">

                <h2>Product Details</h2>

                <div className="product-grid">

                    <div className="form-group">

                        <label>
                            Product ID:
                        </label>

                        <input
                            type="text"
                            value={productId}
                            readOnly
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Product:
                        </label>

                        <select
                            value={selectedProduct}
                            onChange={handleProductChange}
                        >

                            <option value="">
                                -- Select Product --
                            </option>

                            {products.map(product => (

                                <option
                                    key={product.id}
                                    value={product.id}
                                >
                                    {product.product_name}
                                </option>

                            ))}

                        </select>

                    </div>


                    <div className="form-group">

                        <label>
                            Rate:
                        </label>

                        <input
                            type="text"
                            value={price}
                            readOnly
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Quantity:
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(
                                    Number(e.target.value)
                                )
                            }
                        />

                    </div>


                    <button
                        className="add-button"
                        onClick={addProduct}
                    >
                        ➕ Add
                    </button>

                </div>

            </div>


            {/* BILL TABLE + CALCULATION */}

            <div className="bill-bottom">

                {/* BILL TABLE */}

                <div className="bill-table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>Product ID</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {billItems.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="no-products"
                                    >
                                        No products added
                                    </td>

                                </tr>

                            ) : (

                                billItems.map(
                                    (item, index) => (

                                        <tr key={index}>

                                            <td>
                                                {item.productId}
                                            </td>

                                            <td>
                                                {item.productName}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    item.price
                                                ).toFixed(2)}
                                            </td>

                                            <td>
                                                {item.quantity}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    item.total
                                                ).toFixed(2)}
                                            </td>

                                            <td>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        deleteItem(
                                                            index
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )
                            )}

                        </tbody>

                    </table>

                </div>


                {/* CALCULATION */}

                <div className="calculation-container">

                    <h2>
                        Calculation Details
                    </h2>


                    <div className="calculation-row">

                        <label>
                            Total:
                        </label>

                        <input
                            type="text"
                            value={`₹ ${total.toFixed(2)}`}
                            readOnly
                        />

                    </div>


                    <div className="calculation-row">

                        <label>
                            Paid Amount:
                        </label>

                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={paidAmount}
                            onChange={(e) =>
                                setPaidAmount(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="calculation-row">

                        <label>
                            Return Amount:
                        </label>

                        <input
                            type="text"
                            value={
                                `₹ ${
                                    returnAmount > 0
                                        ? returnAmount.toFixed(2)
                                        : "0.00"
                                }`
                            }
                            readOnly
                        />

                    </div>


                    <button
                        className="save-bill-button"
                        onClick={saveBill}
                    >
                        💾 Save Bill
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Cart;