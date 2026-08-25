import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegistrationPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:9090/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            role: "CUSTOMER",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || data.message || "Registration failed");
        return;
      }

      setMessage("Registration successful");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to server");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Create Account</h1>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        {message && <p>{message}</p>}

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f4f4",
  },
  card: {
    width: "400px",
    padding: "30px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 0 15px #ccc",
    textAlign: "center",
  },
  input: {
    width: "90%",
    padding: "12px",
    margin: "10px 0",
  },
  button: {
    width: "98%",
    padding: "12px",
    background: "#1976d2",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};