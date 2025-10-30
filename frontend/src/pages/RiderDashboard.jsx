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
          console.error('Error getting location:', error);
          // Set a default location (e.g., city center) or show an error message
        }
      );
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
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="20">20 km</option>
              <option value="50">50 km</option>
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
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
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