import Button from './Button';

function WaitingStatusCard({ requestDetails, onCancel }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: 'clamp(20px, 5vw, 24px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      margin: '20px auto',
      maxWidth: '100%',
      textAlign: 'center',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      {/* Animated waiting indicator */}
      <div style={{
        width: 'clamp(50px, 12vw, 60px)',
        height: 'clamp(50px, 12vw, 60px)',
        margin: '0 auto 20px',
        borderRadius: '50%',
        border: '3px solid #e5e7eb',
        borderTop: '3px solid #3b82f6',
        animation: 'spin 1s linear infinite'
      }} />

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <h2 style={{ 
        color: '#374151',
        marginBottom: '12px',
        fontSize: 'clamp(20px, 4vw, 24px)',
        fontWeight: '600'
      }}>
        Finding Your Rider
      </h2>

      <p style={{
        color: '#6b7280',
        fontSize: 'clamp(14px, 3.5vw, 16px)',
        marginBottom: '24px',
        lineHeight: '1.5'
      }}>
        Hang tight! We're matching you with the best rider...
      </p>

      {/* Request details */}
      <div style={{
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        padding: 'clamp(16px, 4vw, 20px)',
        marginBottom: '20px',
        textAlign: 'left',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ 
          margin: '0 0 16px 0',
          fontSize: 'clamp(16px, 4vw, 18px)',
          color: '#374151',
          fontWeight: '600'
        }}>
          Your Request
        </h3>
        
        <div style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', color: '#6b7280' }}>
          <p style={{ 
            margin: '12px 0',
            wordBreak: 'break-word'
          }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>From:</span> {requestDetails.pickupLocation}
          </p>
          <p style={{ 
            margin: '12px 0',
            wordBreak: 'break-word'
          }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Time:</span> {new Date(requestDetails.requestedTime).toLocaleString()}
          </p>
          {requestDetails.notes && (
            <p style={{ 
              margin: '12px 0',
              wordBreak: 'break-word'
            }}>
              <span style={{ fontWeight: '600', color: '#374151' }}>Notes:</span> {requestDetails.notes}
            </p>
          )}
        </div>
      </div>

      {/* Cancel button */}
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
        Cancel Request
      </Button>
    </div>
  );
}

export default WaitingStatusCard;
