import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/login.css";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleLogin = (event) => {
        event.preventDefault();

        const validationErrors = {};

        if (!username.trim()) {
            validationErrors.username = "Username is required";
        }

        if (!password) {
            validationErrors.password = "Password is required";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

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

                setErrors({ login: "Invalid username or password" });

            }

        })

        .catch((err) => {

            console.log(err);

            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setErrors({ login: "Invalid username or password" });
            } else {
                setErrors({ login: "Unable to connect to the server" });
            }

        });

    };

    return (

        <div className="login-container">

            <div className="login-box">

                <div className="login-image" aria-hidden="true">
                    <img
                        src="/login_BG.png"
                        alt=""
                    />
                    <div className="image-tint" />
                    <div className="image-copy">
                        <strong>SuperMart</strong>
                        <span>Everything you need, all in one place.</span>
                    </div>
                </div>

                <form className="login-content" onSubmit={handleLogin} noValidate>
                    <div className="login-brand">SUPERMART</div>
                    <h2>Welcome back</h2>
                    <p className="login-subtitle">Please sign in to continue</p>

                    {errors.login && <p className="login-error" role="alert">{errors.login}</p>}

                    <label htmlFor="username">Email or username</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Enter Username"
                        value={username}
                        className={errors.username ? "input-error" : ""}
                        onChange={(e) => setUsername(e.target.value)}
                        aria-invalid={Boolean(errors.username)}
                        aria-describedby={errors.username ? "username-error" : undefined}
                    />
                    {errors.username && <span id="username-error" className="field-error">{errors.username}</span>}

                    <label htmlFor="password">Password</label>
                    <div className="password-field">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            value={password}
                            className={errors.password ? "input-error" : ""}
                            onChange={(e) => setPassword(e.target.value)}
                            aria-invalid={Boolean(errors.password)}
                            aria-describedby={errors.password ? "password-error" : undefined}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "◉" : "◌"}
                        </button>
                    </div>
                    {errors.password && <span id="password-error" className="field-error">{errors.password}</span>}

                    <button className="login-btn" type="submit">
                        Login
                    </button>
                </form>

            </div>

        </div>

    );

}

export default Login;