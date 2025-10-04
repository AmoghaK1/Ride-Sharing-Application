function RiderView() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column",
      backgroundColor: "#f0f8ff",
      padding: "20px"
    }}>
      <h1 style={{
        fontSize: "3rem",
        color: "#007bff",
        marginBottom: "20px",
        textAlign: "center"
      }}>
        Rider View
      </h1>
      <p style={{
        fontSize: "1.2rem",
        color: "#555",
        textAlign: "center",
        maxWidth: "600px"
      }}>
        Welcome to the Rider Dashboard! You have a vehicle and can offer rides to hostelites.
      </p>
    </div>
  );
}

export default RiderView;
