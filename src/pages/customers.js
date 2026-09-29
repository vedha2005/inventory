import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../css/customers.css";

function Customers() {

    // ==========================
    // User Role / Branch
    // ==========================

    const role = localStorage.getItem("role");
    const branchId = localStorage.getItem("branch_id");

    const getHeaders = () => {

        const headers = {
            "x-role": role
        };

        if (branchId) {
            headers["x-branch-id"] = branchId;
        }

        return headers;
    };


    // ==========================
    // State
    // ==========================

    const [showForm, setShowForm] = useState(false);

    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const [customers, setCustomers] = useState([]);


    // ==========================
    // Get Customers
    // ==========================

    const getCustomers = useCallback(async () => {

        try {

            const res = await axios.get(
                "http://localhost:5000/api/customers",
                {
                    headers: getHeaders()
                }
            );

            setCustomers(res.data);

        } catch (err) {

            console.log("GET CUSTOMERS ERROR:", err);

            alert(
                err.response?.data?.message ||
                "Failed to load customers"
            );

        }

    }, [role, branchId]);


    // ==========================
    // Load Customers
    // ==========================

    useEffect(() => {

        getCustomers();

    }, [getCustomers]);


    // ==========================
    // Add Customer
    // ==========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                "http://localhost:5000/api/customers",
                {
                    customerName,
                    phone,
                    email,
                    address
                },
                {
                    headers: getHeaders()
                }
            );

            alert(res.data.message);

            setCustomerName("");
            setPhone("");
            setEmail("");
            setAddress("");
            setShowForm(false);

            // Refresh customer list
            getCustomers();

        } catch (err) {

            console.log("ADD CUSTOMER ERROR:", err);

            alert(
                err.response?.data?.message ||
                "Failed to add customer"
            );

        }

    };


    // ==========================
    // Delete Customer
    // ==========================

    const deleteCustomer = async (id) => {

        try {

            const res = await axios.delete(
                `http://localhost:5000/api/customers/${id}`,
                {
                    headers: getHeaders()
                }
            );

            alert(res.data.message);

            // Refresh customer list
            getCustomers();

        } catch (err) {

            console.log("DELETE CUSTOMER ERROR:", err);

            alert(
                err.response?.data?.message ||
                "Failed to delete customer"
            );

        }

    };


    // ==========================
    // UI
    // ==========================

    return (

        <div className="customers-container">

            <h1>Customer Management</h1>


            {/* Add Customer Button */}

            {!showForm && (

                <button
                    className="add-btn"
                    onClick={() => setShowForm(true)}
                >
                    ➕ Add Customer
                </button>

            )}


            {/* Customer Form */}

            {showForm && (

                <form
                    className="customer-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        type="text"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) =>
                            setCustomerName(e.target.value)
                        }
                        required
                    />


                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) =>
                            setPhone(e.target.value)
                        }
                        required
                    />


                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />


                    <textarea
                        placeholder="Address"
                        value={address}
                        onChange={(e) =>
                            setAddress(e.target.value)
                        }
                    />


                    <div className="btn-group">

                        <button
                            type="submit"
                            className="save-btn"
                        >
                            Save Customer
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


            {/* Customer List */}

            <h2>Added Customers</h2>


            <table className="customers-table">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Action</th>

                    </tr>

                </thead>


                <tbody>

                    {customers.map((customer) => (

                        <tr
                            key={customer.customer_id}
                        >

                            <td>
                                {customer.customer_id}
                            </td>


                            <td>
                                {customer.customer_name}
                            </td>


                            <td>
                                {customer.phone}
                            </td>


                            <td>
                                {customer.email}
                            </td>


                            <td>
                                {customer.address}
                            </td>


                            <td>

                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        deleteCustomer(
                                            customer.customer_id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}


                    {customers.length === 0 && (

                        <tr>

                            <td
                                colSpan="6"
                                className="table-message"
                            >
                                No customers found.
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default Customers;