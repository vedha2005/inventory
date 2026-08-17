import "../css/navbar.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <nav className="navbar">

      <div className="logo">
        🛒 SuperMart
      </div>

      <ul className="nav-links">

        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/customers">Customers</Link></li>
        <li><Link to="/cart">Billing</Link></li>

        <li>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </li>

      </ul>

    </nav>
  );
}

export default Navbar;