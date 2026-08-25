import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:9090/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Invalid username or password");
        return;
      }

      console.log("Login success:", data);

      // Header/Profile read this back via localStorage.getItem("username")
      localStorage.setItem("username", data.username);

      navigate("/home");
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="login-page">
      <div className="tag-wrapper">
        <div className="tag-string" aria-hidden="true"></div>

        <div className="login-card">
          <div className="punch-hole" aria-hidden="true"></div>

          <header className="ticket-header">
            <div className="brand-mark">
              <span className="brand-badge">%</span>
              <h1>Sales Savvy</h1>
            </div>
            <p className="tagline">
              Welcome back — sign in to keep saving.
            </p>
          </header>

          <div className="perforation" aria-hidden="true"></div>

          <div className="ticket-body">
            {message && (
              <div className="error-message">
                <span className="error-icon">!</span>
                {message}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>

                <div className="password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <span
                    className="show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>
              </div>

              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <span className="forgot-password">
                  Forgot Password?
                </span>
              </div>

              <button type="submit" className="login-btn">
                Log In
              </button>
            </form>

            <div className="barcode" aria-hidden="true"></div>
            <p className="sku">SKU 4471-88-SAVVY &middot; SCAN TO ENTER</p>

            <p className="register-text">
              Don't have an account?
              <span onClick={() => navigate("/register")}>
                Create Account
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}