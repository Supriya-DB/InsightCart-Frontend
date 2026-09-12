import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:9090/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          /*
           * VERY IMPORTANT
           * This allows the browser to receive/send
           * the authentication cookie.
           */
          credentials: "include",

          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        setMessage(
          data.message ||
            data.error ||
            "Invalid username or password"
        );

        return;
      }

      /*
       * Save username for displaying in navbar/dashboard.
       */
      localStorage.setItem(
        "username",
        data.username || username
      );

      /*
       * Save role if backend returns it.
       */
      if (data.role) {
        localStorage.setItem(
          "role",
          data.role
        );
      }

      console.log(
        "Login successful"
      );

      console.log(
        "Role:",
        data.role
      );

      /*
       * IMPORTANT:
       *
       * Your backend is using a cookie/JWT.
       * We do NOT need to read the JWT from
       * the response.
       *
       * Browser stores the cookie because:
       * credentials: "include"
       *
       * Now decide where to go.
       */

      const userRole =
        data.role ||
        data.user?.role ||
        "";

      if (
        userRole === "ADMIN" ||
        username.toLowerCase() === "admin"
      ) {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate("/home", {
          replace: true,
        });
      }

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      setMessage(
        "Unable to connect to server."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="login-page">

      <div className="tag-wrapper">

        <div
          className="tag-string"
          aria-hidden="true"
        />

        <div className="login-card">

          <div
            className="punch-hole"
            aria-hidden="true"
          />

          <header className="ticket-header">

            <div className="brand-mark">

              <span className="brand-badge">
                %
              </span>

              <h1>
                INSIGHTCART
              </h1>

            </div>

            <p className="tagline">
              Welcome back — sign in to keep saving.
            </p>

          </header>


          <div
            className="perforation"
            aria-hidden="true"
          />


          <div className="ticket-body">

            {message && (
              <div className="error-message">

                <span className="error-icon">
                  !
                </span>

                {message}

              </div>
            )}


            <form onSubmit={handleLogin}>

              {/* USERNAME */}

              <div className="input-group">

                <label htmlFor="username">
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  required
                />

              </div>


              {/* PASSWORD */}

              <div className="input-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="password-wrapper">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                  <span
                    className="show-password"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </span>

                </div>

              </div>


              {/* OPTIONS */}

              <div className="login-options">

                <label className="remember-me">

                  <input
                    type="checkbox"
                  />

                  <span>
                    Remember me
                  </span>

                </label>


                <span className="forgot-password">
                  Forgot Password?
                </span>

              </div>


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >

                {loading
                  ? "LOGGING IN..."
                  : "LOG IN"}

              </button>

            </form>


            <div
              className="barcode"
              aria-hidden="true"
            />

            <p className="sku">
              SKU 4471-88-SAVVY
              &middot;
              SCAN TO ENTER
            </p>


            <p className="register-text">

              Don't have an account?

              <span
                onClick={() =>
                  navigate("/register")
                }
              >
                Create Account
              </span>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}