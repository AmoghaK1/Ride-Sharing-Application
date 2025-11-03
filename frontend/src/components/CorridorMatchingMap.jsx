import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './CorridorMatchingMap.css';

const CorridorMatchingMap = () => {
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/routing/simulate-corridor-matching');
      const data = await response.json();
      
      if (data.success) {
        setSimulationData(data.data);
      } else {
        setError('Simulation failed');
      }
    } catch (err) {
      setError('Failed to fetch simulation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-run simulation on component mount
    runSimulation();
  }, []);

  // Calculate map center from route or use default Pune coordinates
  const getMapCenter = () => {
    if (simulationData?.route && simulationData.route.length > 0) {
      const midIndex = Math.floor(simulationData.route.length / 2);
      return [simulationData.route[midIndex].lat, simulationData.route[midIndex].lng];
    }
    return [18.5400, 18.8400]; // Default Pune center
  };

  return (
    <div className="corridor-matching-container">
      <div className="control-panel">
        <div className="panel-header">
          <h2>🎯 Geometric Corridor Matching Algorithm Demo</h2>
          <button 
            onClick={runSimulation} 
            disabled={loading}
            className="run-simulation-btn"
          >
            {loading ? '🔄 Running...' : '▶️ Run Simulation'}
          </button>
        </div>

        {error && (
          <div className="error-message">❌ {error}</div>
        )}

        {simulationData && (
          <div className="simulation-info">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Route Points:</span>
                <span className="info-value">{simulationData.route_points}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Matches Found:</span>
                <span className="info-value">{simulationData.total_matches}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Selected:</span>
                <span className="info-value">{simulationData.selected_matches}</span>
              </div>
            </div>

            <div className="matches-list">
              <h3>✅ Selected Hostelites:</h3>
              {simulationData.matches.map((match, idx) => (
                <div key={idx} className="match-summary">
                  <span className="match-number">#{match.pickup_order}</span>
                  <span className="match-name">{match.hostelite_name}</span>
                  <span className="match-distance">{match.distance_from_route_meters}m</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="map-container">
        <MapContainer 
          center={getMapCenter()} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution="&copy; OpenStreetMap contributors" 
          />

          {simulationData && (
            <>
              {/* Demo Route */}
              <Polyline 
                positions={simulationData.route.map(p => [p.lat, p.lng])} 
                color="#3498db" 
                weight={6} 
                opacity={0.8}
              />

              {/* Route Points */}
              {simulationData.route.map((point, idx) => (
                <CircleMarker 
                  key={`route-${idx}`}
                  center={[point.lat, point.lng]} 
                  radius={4} 
                  color="#2980b9" 
                  fillColor="#3498db" 
                  fillOpacity={0.8}
                  weight={2}
                >
                  <Popup>
                    <div>
                      <strong>📍 Route Point {idx + 1}</strong><br />
                      {idx === 0 && "🏠 Start (Home)"}
                      {idx === simulationData.route.length - 1 && "🎓 End (College)"}
                      {idx > 0 && idx < simulationData.route.length - 1 && "🛣️ Route Point"}
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {/* Hostelites */}
              {simulationData.matches.map((match, idx) => (
                <div key={`hostelite-group-${idx}`}>
                  {/* Hostelite Location */}
                  <CircleMarker 
                    center={[match.hostelite_location.lat, match.hostelite_location.lng]} 
                    radius={12} 
                    color="#27ae60" 
                    fillColor="#2ecc71" 
                    fillOpacity={0.9}
                    weight={3}
                  >
                    <Popup>
                      <div style={{ minWidth: '220px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#27ae60' }}>
                          🧑‍🎓 {match.hostelite_name}
                        </h4>
                        <div className="popup-details">
                          <div><strong>📍 Pickup Order:</strong> #{match.pickup_order}</div>
                          <div><strong>📏 Distance from Route:</strong> {match.distance_from_route_meters}m</div>
                          <div><strong>⏰ Pickup Time:</strong> +{match.estimated_pickup_time_minutes} min</div>
                          <div><strong>📞 Contact:</strong> {match.phone}</div>
                        </div>
                        <div className="algorithm-badge">
                          🎯 Found by Geometric Corridor Matching
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>

                  {/* Pickup Point */}
                  <CircleMarker 
                    center={[match.pickup_point.lat, match.pickup_point.lng]} 
                    radius={8} 
                    color="#f39c12" 
                    fillColor="#f1c40f" 
                    fillOpacity={0.9}
                    weight={2}
                  >
                    <Popup>
                      <div>
                        <strong>🚩 Pickup Point</strong><br />
                        for {match.hostelite_name}<br />
                        <small>Closest point on route</small>
                      </div>
                    </Popup>
                  </CircleMarker>

                  {/* Connection Line */}
                  <Polyline 
                    positions={[
                      [match.hostelite_location.lat, match.hostelite_location.lng],
                      [match.pickup_point.lat, match.pickup_point.lng]
                    ]} 
                    color="#27ae60" 
                    weight={2} 
                    dashArray="8,4"
                    opacity={0.8}
                  />

                  {/* Pickup Order Label */}
                  <CircleMarker 
                    center={[match.hostelite_location.lat + 0.0005, match.hostelite_location.lng + 0.0005]} 
                    radius={6} 
                    color="#fff" 
                    fillColor="#e74c3c" 
                    fillOpacity={1}
                    weight={2}
                  >
                    <Popup>
                      <strong>Pickup #{match.pickup_order}</strong>
                    </Popup>
                  </CircleMarker>
                </div>
              ))}

              {/* Start and End Markers */}
              {simulationData.route.length > 0 && (
                <>
                  {/* Start (Home) */}
                  <CircleMarker 
                    center={[simulationData.route[0].lat, simulationData.route[0].lng]} 
                    radius={10} 
                    color="#e74c3c" 
                    fillColor="#e74c3c" 
                    fillOpacity={0.9}
                    weight={3}
                  >
                    <Popup>
                      <div>
                        <strong>🏠 Rider's Home</strong><br />
                        Journey Start Point
                      </div>
                    </Popup>
                  </CircleMarker>

                  {/* End (College) */}
                  <CircleMarker 
                    center={[simulationData.route[simulationData.route.length - 1].lat, simulationData.route[simulationData.route.length - 1].lng]} 
                    radius={10} 
                    color="#8e44ad" 
                    fillColor="#9b59b6" 
                    fillOpacity={0.9}
                    weight={3}
                  >
                    <Popup>
                      <div>
                        <strong>🎓 College</strong><br />
                        Final Destination
                      </div>
                    </Popup>
                  </CircleMarker>
                </>
              )}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default CorridorMatchingMap;