import { useState, useEffect } from 'react';
import axios from 'axios';
import './RideRequestsList.css';

const RideRequestsList = ({ currentLocation, maxDistance = 10, timeWindow = 60 }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNearbyRides = async () => {
      try {
        setLoading(true);
        const response = await axios.post('/api/rides/nearby', {
          current_location: currentLocation,
          max_distance: maxDistance,
          time_window: timeWindow,
          status: ['pending']
        });
        setRequests(response.data.rides);
      } catch (err) {
        setError('Failed to fetch nearby ride requests');
        console.error('Error fetching ride requests:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentLocation) {
      fetchNearbyRides();
    }
  }, [currentLocation, maxDistance, timeWindow]);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDistance = (distance) => {
    return `${distance.toFixed(1)} km`;
  };

  if (loading) return <div className="loading">Loading nearby requests...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!requests.length) return <div className="no-rides">No ride requests found nearby</div>;

  return (
    <div className="ride-requests-list">
      <h2>Nearby Ride Requests</h2>
      <div className="requests-container">
        {requests.map((request) => (
          <div key={request.id} className="ride-request-card">
            <div className="request-header">
              <span className="pickup-time">{formatTime(request.pickup_time)}</span>
              <span className="distance">{formatDistance(request.distance_to_pickup)}</span>
            </div>
            <div className="locations">
              <div className="pickup">
                <i className="location-icon pickup"></i>
                <span>{request.pickup_location.address}</span>
              </div>
              <div className="dropoff">
                <i className="location-icon dropoff"></i>
                <span>{request.dropoff_location.address}</span>
              </div>
            </div>
            <div className="request-details">
              <span className="passengers">
                {request.number_of_passengers} passenger{request.number_of_passengers > 1 ? 's' : ''}
              </span>
              <span className="fare">₹{request.estimated_fare}</span>
            </div>
            {request.special_requirements && (
              <div className="special-requirements">
                <i className="info-icon"></i>
                <span>{request.special_requirements}</span>
              </div>
            )}
            <button className="accept-btn" onClick={() => onAcceptRequest(request.id)}>
              Accept Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};