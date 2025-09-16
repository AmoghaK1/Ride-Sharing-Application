import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // stops page reload
    console.log("Email:", email, "Password:", password);
    alert(`Email: ${email}, Password: ${password}`);
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"
    }}>
      <form onSubmit={handleSubmit} style={{
        display: "flex", flexDirection: "column", width: "300px", gap: "10px",
        padding: "20px", border: "1px solid #ccc", borderRadius: "10px"
      }}>
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{
          padding: "10px", borderRadius: "5px", border: "none",
          backgroundColor: "#007bff", color: "white", fontWeight: "bold"
        }}>
          Login
        </button>
        
        <p style={{
          textAlign: "center",
          marginTop: "15px",
          color: "#666",
          fontSize: "14px"
        }}>
          Don't have an account? 
          <button 
            type="button"
            onClick={() => navigate('/register')}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              textDecoration: "underline",
              cursor: "pointer",
              fontWeight: "500",
              marginLeft: "5px"
            }}
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;