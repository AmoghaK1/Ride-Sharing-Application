import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/rides/match")
      .then(res => setResult(res.data.result))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>College Carpool App 🚗</h1>
      {result ? (
        <div>
          <p><b>Driver:</b> {result.driver}</p>
          <p><b>Rider:</b> {result.rider}</p>
          <p><b>Algorithm:</b> {result.algorithm}</p>
        </div>
      ) : (
        <p>Loading match...</p>
      )}
    </div>
  );
}

export default App;
