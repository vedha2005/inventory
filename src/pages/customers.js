import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/customers.css";

function Customers() {

    const [showForm, setShowForm] = useState(false);

    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const [customers, setCustomers] = useState([]);

    // Get customers from MySQL
    const getCustomers = async () => {

        try {

            const res = await axios.get(
                "http://localhost:5000/api/customers"
            );

            setCustomers(res.data);

        } catch (err) {

            console.log(err);
            alert("Failed to load customers");

        }

    };

    // Load customers when page opens
    useEffect(() => {
        getCustomers();
    }, []);

    // Add customer
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

            console.log(err);
            alert("Failed to add customer");

        }

    };

    // Delete customer
    const deleteCustomer = async (id) => {

        try {

            const res = await axios.delete(
                `http://localhost:5000/api/customers/${id}`
            );

            alert(res.data.message);

            getCustomers();

        } catch (err) {

            console.log(err);
            alert("Failed to delete customer");

        }

    };

    return (

        <div className="customers-container">

            <h1>Customer Management</h1>

            {!showForm && (

                <button
                    className="add-btn"
                    onClick={() => setShowForm(true)}
                >
                    ➕ Add Customer
                </button>

            )}

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

                        <tr key={customer.customer_id}>

                            <td>{customer.customer_id}</td>

                            <td>{customer.customer_name}</td>

                            <td>{customer.phone}</td>

                            <td>{customer.email}</td>

                            <td>{customer.address}</td>

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

                </tbody>

            </table>

        </div>

    );

}

export default Customers;