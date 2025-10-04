import { useState, useEffect } from 'react';
import Button from './Button';

function RiderMatchCard({ riderDetails, pickupInfo, onCancel }) {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const pickupTime = new Date(pickupInfo.estimatedPickupTime);
      const diff = pickupTime - now;

      if (diff <= 0) {
        setTimeRemaining('Arriving now!');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [pickupInfo.estimatedPickupTime]);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: 'clamp(20px, 5vw, 24px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      margin: '20px auto',
      maxWidth: '100%',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      {/* Success banner */}
      <div style={{
        backgroundColor: '#059669',
        color: 'white',
        padding: 'clamp(12px, 3vw, 16px)',
        borderRadius: '6px',
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 'clamp(14px, 3.5vw, 16px)'
      }}>
        Rider Found! Your ride is confirmed
      </div>

      {/* Countdown timer */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px',
        backgroundColor: '#f0f6ff',
        padding: 'clamp(20px, 5vw, 24px)',
        borderRadius: '8px',
        border: '1px solid #e0f2fe'
      }}>
        <h2 style={{
          fontSize: 'clamp(32px, 8vw, 40px)',
          color: '#3b82f6',
          margin: '0 0 8px 0',
          fontWeight: 'bold'
        }}>
          {timeRemaining}
        </h2>
        <p style={{
          color: '#6b7280',
          fontSize: 'clamp(13px, 3.5vw, 15px)',
          margin: 0,
          fontWeight: '500'
        }}>
          Until pickup
        </p>
      </div>

      {/* Rider details */}
      <div style={{
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        padding: 'clamp(16px, 4vw, 20px)',
        marginBottom: '16px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ 
          margin: '0 0 16px 0',
          fontSize: 'clamp(16px, 4vw, 18px)',
          color: '#374151',
          borderBottom: '2px solid #3b82f6',
          paddingBottom: '8px',
          fontWeight: '600'
        }}>
          Your Rider
        </h3>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(12px, 3vw, 16px)', 
          marginBottom: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Rider avatar */}
          <div style={{
            width: 'clamp(45px, 10vw, 50px)',
            height: 'clamp(45px, 10vw, 50px)',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(18px, 4vw, 20px)',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            {riderDetails.name.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: '0' }}>
            <p style={{ 
              margin: '0 0 6px 0', 
              fontSize: 'clamp(16px, 4vw, 18px)', 
              fontWeight: '600',
              wordBreak: 'break-word',
              color: '#374151'
            }}>
              {riderDetails.name}
            </p>
            <p style={{ 
              margin: 0, 
              color: '#6b7280', 
              fontSize: 'clamp(12px, 3vw, 14px)' 
            }}>
              Rating: {riderDetails.rating} • {riderDetails.ridesCompleted} rides
            </p>
          </div>
        </div>

        <div style={{ 
          fontSize: 'clamp(13px, 3.5vw, 15px)', 
          color: '#6b7280' 
        }}>
          <p style={{ 
            margin: '12px 0',
            wordBreak: 'break-word'
          }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Phone:</span> {riderDetails.phone}
          </p>
          <p style={{ 
            margin: '12px 0',
            wordBreak: 'break-word'
          }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Vehicle:</span> {riderDetails.vehicleType} - {riderDetails.vehicleNumber}
          </p>
          <p style={{ 
            margin: '12px 0',
            wordBreak: 'break-word'
          }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Color:</span> {riderDetails.vehicleColor}
          </p>
        </div>
      </div>

      {/* Pickup info */}
      <div style={{
        backgroundColor: '#fffbeb',
        borderRadius: '8px',
        padding: 'clamp(16px, 4vw, 20px)',
        marginBottom: '20px',
        border: '1px solid #fed7aa'
      }}>
        <h3 style={{ 
          margin: '0 0 12px 0',
          fontSize: 'clamp(16px, 4vw, 18px)',
          color: '#374151',
          fontWeight: '600'
        }}>
          Pickup Details
        </h3>
        
        <div style={{ 
          fontSize: 'clamp(13px, 3.5vw, 15px)', 
          color: '#6b7280' 
        }}>
          <p style={{ 
            margin: '12px 0',
            wordBreak: 'break-word'
          }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Location:</span> {pickupInfo.location}
          </p>
          <p style={{ 
            margin: '12px 0',
            wordBreak: 'break-word'
          }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Time:</span> {new Date(pickupInfo.estimatedPickupTime).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ 
        display: 'flex', 
        gap: 'clamp(8px, 2vw, 12px)',
        flexDirection: 'column'
      }}>
        <Button 
          variant="primary"
          onClick={() => window.open(`tel:${riderDetails.phone}`)}
          style={{ 
            backgroundColor: '#059669',
            fontSize: 'clamp(14px, 3.5vw, 15px)',
            padding: 'clamp(12px, 3vw, 14px)',
            borderRadius: '6px',
            width: '100%'
          }}
        >
          Call Rider
        </Button>
        <Button 
          variant="secondary" 
          onClick={onCancel}
          style={{ 
            backgroundColor: '#dc2626',
            fontSize: 'clamp(14px, 3.5vw, 15px)',
            padding: 'clamp(12px, 3vw, 14px)',
            borderRadius: '6px',
            width: '100%'
          }}
        >
          Cancel Ride
        </Button>
      </div>
    </div>
  );
}

export default RiderMatchCard;
