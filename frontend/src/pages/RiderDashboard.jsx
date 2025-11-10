import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HostelitesList from '../components/HostelitesList/HostelitesList';
import './RiderDashboard.css';

const RiderDashboard = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [filters, setFilters] = useState({
    maxDistance: 10,  // in kilometers
    timeWindow: 60    // in minutes
  });

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: 'Current Location' // You might want to use reverse geocoding here
          });
        },
        (error) => {
          console.error('Error getting location (geolocation not available on HTTP):', error);
          // Set a default location for HTTP sites
          setCurrentLocation({
            latitude: 18.518626152971162,
            longitude: 73.90637766220793,
            address: 'Default Location'
          });
        },
        {
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      // Browser doesn't support geolocation, use default
      setCurrentLocation({
        latitude: 18.518626152971162,
        longitude: 73.90637766220793,
        address: 'Default Location'
      });
    }
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  return (
    <div className="rider-dashboard">
      <header className="dashboard-header">
        <h1>Available Rides</h1>
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="maxDistance">Max Distance:</label>
            <select
              id="maxDistance"
              name="maxDistance"
              value={filters.maxDistance}
              onChange={handleFilterChange}
            >
              <option value="5">100 m</option>
              <option value="10">200 m</option>
              <option value="20">500 m</option>
              <option value="50">1 km</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="timeWindow">Time Window:</label>
            <select
              id="timeWindow"
              name="timeWindow"
              value={filters.timeWindow}
              onChange={handleFilterChange}
            >
              <option value="30">2 minutes</option>
              <option value="60">5 minutes</option>
              <option value="120">10 minutes</option>
            </select>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        {currentLocation ? (
          <HostelitesList
            currentLocation={currentLocation}
            maxDistance={filters.maxDistance}
            timeWindow={filters.timeWindow}
          />
        ) : (
          <div className="location-prompt">
            Please enable location access to see nearby ride requests
          </div>
        )}
      </main>
    </div>
  );
};

export default RiderDashboard;