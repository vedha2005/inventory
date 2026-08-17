import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/login.css";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {

        axios.post("http://localhost:5000/api/auth/login",  {

            username: username,
            password: password

        })

        .then((res) => {

            if (res.data.success) {

                // Save login status
                localStorage.setItem("isLoggedIn", "true");

                // Go to Home page
                navigate("/admin");

            } else {

                alert("Invalid Username or Password");

            }

        })

        .catch((err) => {

            console.log(err);

            alert("Server Error");

        });

    };

    return (

        <div className="login-container">

            <div className="login-box">

                <h2>SuperMart Login</h2>

                <input
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={handleLogin}>
                    Login
                </button>

            </div>

        </div>

    );

}

export default Login;