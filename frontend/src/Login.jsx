import { useState } from "react";

function Login() {
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
      </form>
    </div>
  );
}

export default Login;
