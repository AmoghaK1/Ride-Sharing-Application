import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f5f5",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        maxWidth: "500px",
        width: "100%"
      }}>
        <h1 style={{
          color: "#333",
          marginBottom: "20px",
          fontSize: "28px"
        }}>
          Welcome, {user.full_name}!
        </h1>
        
        <p style={{
          color: "#666",
          marginBottom: "30px",
          fontSize: "16px"
        }}>
          You have successfully logged in to your dashboard.
        </p>
        
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;