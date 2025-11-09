import React, { useState, useEffect } from 'react';
import AppBar from '../components/AppBar';
import './Network.css';

const Network = () => {
  const [networkInfo, setNetworkInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNetworkInfo();
  }, []);

  const fetchNetworkInfo = async () => {
    try {
      const response = await fetch('http://localhost:8000/rider/network/info');
      if (!response.ok) {
        throw new Error('Failed to fetch network info');
      }
      const data = await response.json();
      setNetworkInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="network-container">
        <AppBar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Pune Area Network...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="network-container">
        <AppBar />
        <div className="error-container">
          <h2>Error Loading Network</h2>
          <p>{error}</p>
          <button onClick={fetchNetworkInfo} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="network-container">
      <AppBar />
      <div className="network-content">
        <div className="network-header">
          <h1>Pune Area Network Map</h1>
          <p className="network-subtitle">Interactive ride-sharing network visualization</p>
        </div>

        <div className="network-info-cards">
          <div className="info-card">
            <h3>{networkInfo?.total_areas}</h3>
            <p>Areas Covered</p>
          </div>
          <div className="info-card">
            <h3>{networkInfo?.total_connections}</h3>
            <p>Route Connections</p>
          </div>
          <div className="info-card">
            <h3>{networkInfo?.destination}</h3>
            <p>Destination</p>
          </div>
        </div>

        <div className="network-visualization">
          <div className="graph-container">
            <img 
              src="http://localhost:8000/rider/network" 
              alt="Pune Area Network Graph"
              className="network-graph"
              onError={(e) => {
                e.target.style.display = 'none';
                setError('Failed to load network graph');
              }}
            />
          </div>
        </div>

        <div className="network-features">
          <h2>Network Features</h2>
          <div className="features-grid">
            {networkInfo?.features?.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">✓</div>
                <p>{feature}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="network-legend">
          <h3>Legend</h3>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color red"></div>
              <span>VIIT College (Destination)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color blue"></div>
              <span>Major Transportation Hubs</span>
            </div>
            <div className="legend-item">
              <div className="legend-color green"></div>
              <span>Residential Areas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;