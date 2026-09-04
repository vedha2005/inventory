import "../css/navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();
  const pages = ["/admin", "/products", "/customers", "/cart"];
  const currentPage = pages.indexOf(location.pathname);

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <nav className="navbar">

      <Link className="logo" to="/admin">
        <span className="logo-mark">S</span>
        Super<span>Mart</span>
      </Link>

      <ul className="nav-links">

        <li><Link className={location.pathname === "/admin" ? "active" : ""} to="/admin">Dashboard</Link></li>
        <li><Link className={location.pathname === "/products" ? "active" : ""} to="/products">Products</Link></li>
        <li><Link className={location.pathname === "/customers" ? "active" : ""} to="/customers">Customers</Link></li>
        <li><Link className={location.pathname === "/cart" ? "active" : ""} to="/cart">Billing</Link></li>

        <li>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </li>

      </ul>

      <div className="page-nav" aria-label="Page navigation">
        <button
          type="button"
          className="page-nav-button back-button"
          onClick={() => currentPage > 0 && navigate(pages[currentPage - 1])}
          disabled={currentPage <= 0}
          aria-label="Back"
          title="Back"
        >
          <span aria-hidden="true">←</span>
          <b>Back</b>
        </button>

        <button
          type="button"
          className="page-nav-button next-button"
          onClick={() =>
            currentPage < pages.length - 1 &&
            navigate(pages[currentPage + 1])
          }
          disabled={currentPage >= pages.length - 1}
          aria-label="Next"
          title="Next"
        >
          <b>Next</b>
          <span aria-hidden="true">→</span>
        </button>
      </div>

    </nav>
  );
}

export default Navbar;