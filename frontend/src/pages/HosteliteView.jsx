import { useState, useEffect } from 'react';
import AppBar from '../components/AppBar';
import RequestForm from '../components/RequestForm';
import WaitingStatusCard from '../components/WaitingStatusCard';
import RiderMatchCard from '../components/RiderMatchCard';

function HosteliteView() {
  const [user, setUser] = useState(null);
  const [rideStatus, setRideStatus] = useState('initial'); // 'initial', 'show-form', 'waiting', 'matched'
  const [requestDetails, setRequestDetails] = useState(null);
  const [riderDetails, setRiderDetails] = useState(null);
  const [pickupInfo, setPickupInfo] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleRequestSubmit = (formData) => {
    console.log('Request submitted:', formData);
    setRequestDetails(formData);
    setRideStatus('waiting');

    // Simulate matching with a rider after 5 seconds (for demo)
    setTimeout(() => {
      // Mock rider data
      const mockRider = {
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        rating: '4.8',
        ridesCompleted: 142,
        vehicleType: 'Honda Activa',
        vehicleNumber: 'KA 01 AB 1234',
        vehicleColor: 'Black'
      };

      const mockPickupInfo = {
        location: formData.pickupLocation,
        estimatedPickupTime: new Date(formData.requestedTime).toISOString()
      };

      setRiderDetails(mockRider);
      setPickupInfo(mockPickupInfo);
      setRideStatus('matched');
    }, 5000);
  };

  const handleCancelRequest = () => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      setRideStatus('initial');
      setRequestDetails(null);
      setRiderDetails(null);
      setPickupInfo(null);
    }
  };

  const handleAskForRide = () => {
    setRideStatus('show-form');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f6ff',
      paddingBottom: '20px',
      overflow: 'hidden'
    }}>
      <AppBar userName={user?.full_name} />
      
      <div style={{
        padding: '16px',
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Conditional rendering based on ride status */}
        {rideStatus === 'initial' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '20px',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#374151',
              fontSize: 'clamp(16px, 4vw, 20px)',
              textAlign: 'center',
              marginBottom: '30px',
              maxWidth: '90%',
              lineHeight: '1.6'
            }}>
              Need a ride? We'll find the perfect match for you!
            </p>
            <button
              onClick={handleAskForRide}
              style={{
                padding: '16px 40px',
                fontSize: 'clamp(16px, 4vw, 18px)',
                fontWeight: '600',
                color: '#ffffff',
                backgroundColor: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              Ask for a Ride
            </button>
          </div>
        )}

        {rideStatus === 'show-form' && (
          <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
            <RequestForm onSubmit={handleRequestSubmit} />
          </div>
        )}

        {rideStatus === 'waiting' && requestDetails && (
          <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
            <WaitingStatusCard 
              requestDetails={requestDetails}
              onCancel={handleCancelRequest}
            />
          </div>
        )}

        {rideStatus === 'matched' && riderDetails && pickupInfo && (
          <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
            <RiderMatchCard
              riderDetails={riderDetails}
              pickupInfo={pickupInfo}
              onCancel={handleCancelRequest}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default HosteliteView;

