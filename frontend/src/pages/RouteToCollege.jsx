import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchWithFallback } from '../constants/api';

const RouteToCollege = () => {
  const [start, setStart] = useState(null);
  const [college, setCollege] = useState(null);
  const [route, setRoute] = useState(null);
  const [error, setError] = useState(null);
  const [graph, setGraph] = useState(null);
  const [hostelites, setHostelites] = useState(null);
  const [showCorridorDemo, setShowCorridorDemo] = useState(false);

  useEffect(() => {
    const initializeLocation = async (pos) => {
      const s = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setStart(s);
      try {
        // Get configured college location
        const clg = await fetchWithFallback('/routing/college-location').then(r => r.json());
        setCollege({ lat: clg.latitude, lng: clg.longitude });
        // fetch campus graph for visualization (nodes + edges)
        try {
          const g = await fetchWithFallback('/routing/graph').then(r => r.json());
          setGraph(g);
        } catch (e) {
          // non-critical: graph visualization optional
          console.warn('Failed to load campus graph', e);
        }
        const res = await fetchWithFallback('/routing/shortest-path-osrm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ start_location: { latitude: s.lat, longitude: s.lng } })
        });
        if (!res.ok) throw new Error('Routing failed');
        const data = await res.json();
        // data.path is [[lat,lng], ...]
        setRoute({ coords: data.path.map(([lat,lng]) => ({ lat, lng })), distance: data.distance_km });
        
        // Fetch corridor matching using actual route
        try {
          const corridorRes = await fetchWithFallback('/routing/find-corridor-matches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              route_points: data.path.map(([lat, lng]) => ({ latitude: lat, longitude: lng })),
              rider_destination: { latitude: clg.latitude, longitude: clg.longitude },
              corridor_width_meters: 1000
            })
          });
          const corridorData = await corridorRes.json();
          console.log('Corridor matching response:', corridorData);
          if (corridorData.success) {
            setHostelites({
              matches: corridorData.matches.map(match => ({
                hostelite_name: match.hostelite_name,
                hostelite_location: match.location,
                pickup_point: match.pickup_point,
                distance_from_route_meters: match.distance_from_route,
                pickup_order: match.pickup_order,
                estimated_pickup_time_minutes: match.estimated_time,
                phone: match.hostelite_id.includes('001') ? '+91-9876543210' : 
                       match.hostelite_id.includes('002') ? '+91-9876543211' : '+91-9876543212'
              })),
              route: data.path.map(([lat, lng]) => ({ lat, lng }))
            });
          }
        } catch (e) {
          console.warn('Failed to load hostelites for real route', e);
        }
      } catch (e) {
        setError(e.message);
      }
    };

    if (!navigator.geolocation) {
      // Use default location if geolocation not supported
      console.warn('Geolocation not supported, using default location');
      initializeLocation({ coords: { latitude: 18.518626152971162, longitude: 73.90637766220793 } });
    } else {
      navigator.geolocation.getCurrentPosition(
        initializeLocation,
        (err) => {
          console.warn('Geolocation failed (HTTP site?), using default location:', err.message);
          // Use default location on error (e.g., HTTP site)
          initializeLocation({ coords: { latitude: 18.518626152971162, longitude: 73.90637766220793 } });
        },
        {
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, []);
  const center = start || college;

  const retryGeolocation = () => {
    setError(null);
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported, using default location');
      setStart({ lat: 18.518626152971162, lng: 73.90637766220793 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const s = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setStart(s);
      },
      (err) => {
        console.warn('Geolocation failed, using default location:', err.message);
        setStart({ lat: 18.518626152971162, lng: 73.90637766220793 });
      }
    );
  };

  // Don't render a map with a hardcoded default center. Require either the
  // rider's real-time location (`start`) or the configured college location
  // (`college`) before showing the map. This prevents falling back to the
  // old Bangalore hardcoded coords.
  if (!center && !error) {
    return (
      <div style={{ padding: 16 }}>
        Requesting geolocation — please allow location access in your browser.
        <div style={{ marginTop: 12 }}>
          <button onClick={retryGeolocation}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {error && (<div style={{ padding: 12, color: '#c00' }}>Error: {error}</div>)}
      
      {/* Corridor Demo Toggle */}
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        right: 10, 
        zIndex: 1000, 
        background: 'white', 
        padding: '10px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={showCorridorDemo} 
            onChange={(e) => setShowCorridorDemo(e.target.checked)}
          />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            🎯 Show Corridor Matching Demo
          </span>
        </label>
        {hostelites && showCorridorDemo && (
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            Found {hostelites.matches.length} hostelites in corridor
          </div>
        )}
        <button 
          style={{
            marginTop: '8px',
            padding: '6px 12px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            width: '100%'
          }}
          onClick={() => window.open('/corridor-demo', '_blank')}
        >
          🎯 Open Full Demo
        </button>
      </div>
      
      <MapContainer center={[center.lat, center.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

        {/* draw campus graph nodes and edges if available */}
        {graph && graph.nodes && graph.edges && (
          <>
            {graph.edges.map((e, idx) => {
              const a = graph.nodes.find(n => n.id === e.from);
              const b = graph.nodes.find(n => n.id === e.to);
              if (!a || !b) return null;
              return (
                <Polyline key={`edge-${idx}`} positions={[[a.lat, a.lng], [b.lat, b.lng]]} color="#888" weight={2} opacity={0.6} />
              );
            })}
            {graph.nodes.map(n => (
              <CircleMarker key={n.id} center={[n.lat, n.lng]} radius={4} color="#555" fillColor="#999" fillOpacity={0.7} />
            ))}
          </>
        )}

        {/* rider (blue) and college (red) markers as CircleMarker for consistent coloring */}
        {start && <CircleMarker center={[start.lat, start.lng]} radius={8} color="#007bff" fillColor="#007bff" fillOpacity={0.9} />}
        {college && <CircleMarker center={[college.lat, college.lng]} radius={8} color="#d9534f" fillColor="#d9534f" fillOpacity={0.9} />}

        {/* route or fallback direct line */}
        {route ? (
          <Polyline positions={route.coords.map(p => [p.lat, p.lng])} color="blue" />
        ) : (
          start && college && (
            <Polyline positions={[[start.lat, start.lng], [college.lat, college.lng]]} color="#3388ff" dashArray="6" />
          )
        )}

        {/* Corridor Matching Demo - Show Hostelites */}
        {showCorridorDemo && hostelites && hostelites.matches && hostelites.matches.map((match, idx) => (
          <div key={`hostelite-${idx}`}>
            {/* Hostelite Location Marker */}
            <CircleMarker 
              center={[match.hostelite_location.lat, match.hostelite_location.lng]} 
              radius={10} 
              color="#28a745" 
              fillColor="#28a745" 
              fillOpacity={0.8}
              weight={3}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#28a745' }}>
                    🧑‍🎓 {match.hostelite_name}
                  </h4>
                  <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                    <div><strong>📍 Pickup Order:</strong> #{match.pickup_order}</div>
                    <div><strong>📏 Distance from Route:</strong> {match.distance_from_route_meters}m</div>
                    <div><strong>⏰ Estimated Time:</strong> +{match.estimated_pickup_time_minutes} min</div>
                    <div><strong>📞 Phone:</strong> {match.phone}</div>
                    <div style={{ marginTop: '8px', padding: '4px', background: '#f8f9fa', borderRadius: '4px', fontSize: '12px' }}>
                      🎯 Found by Geometric Corridor Matching Algorithm
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>

            {/* Pickup Point Marker */}
            <CircleMarker 
              center={[match.pickup_point.lat, match.pickup_point.lng]} 
              radius={6} 
              color="#ffc107" 
              fillColor="#ffc107" 
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

            {/* Line connecting hostelite to pickup point */}
            <Polyline 
              positions={[
                [match.hostelite_location.lat, match.hostelite_location.lng],
                [match.pickup_point.lat, match.pickup_point.lng]
              ]} 
              color="#28a745" 
              weight={2} 
              dashArray="5,5"
              opacity={0.7}
            />
          </div>
        ))}

        {/* Show demo route if corridor demo is active */}
        {showCorridorDemo && hostelites && hostelites.route && (
          <Polyline 
            positions={hostelites.route.map(p => [p.lat, p.lng])} 
            color="#e74c3c" 
            weight={4} 
            opacity={0.8}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default RouteToCollege;
