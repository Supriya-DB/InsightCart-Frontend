import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <header
      style={{
        background: "#1976d2",
        color: "white",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>Sales Savvy</h2>

      <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link style={{ color: "white" }} to="/home">
          Home
        </Link>

        <Link style={{ color: "white" }} to="/cart">
          Cart
        </Link>

        <Link style={{ color: "white" }} to="/orders">
          Orders
        </Link>

        <Link style={{ color: "white" }} to="/profile">
          Profile
        </Link>

        <span>Hello, {username}</span>

        <button
          onClick={logout}
          style={{
            padding: "8px 15px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}