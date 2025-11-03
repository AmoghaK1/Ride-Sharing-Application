import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const RouteToCollege = () => {
  const [start, setStart] = useState(null);
  const [college, setCollege] = useState(null);
  const [route, setRoute] = useState(null);
  const [error, setError] = useState(null);
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const s = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setStart(s);
      try {
        // Get configured college location
        const clg = await fetch('http://localhost:8000/routing/college-location').then(r => r.json());
        setCollege({ lat: clg.latitude, lng: clg.longitude });
        // fetch campus graph for visualization (nodes + edges)
        try {
          const g = await fetch('http://localhost:8000/routing/graph').then(r => r.json());
          setGraph(g);
        } catch (e) {
          // non-critical: graph visualization optional
          console.warn('Failed to load campus graph', e);
        }
        const res = await fetch('http://localhost:8000/routing/shortest-path', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ start_location: { latitude: s.lat, longitude: s.lng } })
        });
        if (!res.ok) throw new Error('Routing failed');
        const data = await res.json();
        // data.path is [[lat,lng], ...]
        setRoute({ coords: data.path.map(([lat,lng]) => ({ lat, lng })), distance: data.distance_km });
      } catch (e) {
        setError(e.message);
      }
    }, (err) => setError(err.message));
  }, []);
  const center = start || college;

  const retryGeolocation = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const s = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setStart(s);
    }, (err) => setError(err.message));
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
      </MapContainer>
    </div>
  );
};

export default RouteToCollege;
