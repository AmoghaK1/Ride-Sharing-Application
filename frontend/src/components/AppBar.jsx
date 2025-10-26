import { useState } from 'react';

function AppBar({ userName }) {
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxSizing: 'border-box'
    }}>
      {/* Left side - App name */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: 'clamp(16px, 4vw, 20px)',
          fontWeight: '600',
          whiteSpace: 'nowrap'
        }}>
          RideShare
        </h2>
      </div>

      {/* Right side - User name, avatar and settings */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)', position: 'relative', flexShrink: 0 }}>
        {/* User name */}
        {userName && (
          <span style={{
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            fontWeight: '500',
            opacity: 0.95,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 'clamp(80px, 20vw, 120px)'
          }}>
            {userName.split(' ')[0]}
          </span>
        )}
        
        {/* User avatar */}
        <div style={{
          width: 'clamp(32px, 7vw, 36px)',
          height: 'clamp(32px, 7vw, 36px)',
          borderRadius: '50%',
          backgroundColor: '#fff',
          color: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: 'clamp(14px, 3.5vw, 16px)'
        }}>
          {userName ? userName.charAt(0).toUpperCase() : 'U'}
        </div>

        {/* Settings icon */}
        <div 
          onClick={() => setShowSettings(!showSettings)}
          style={{
            cursor: 'pointer',
            fontSize: 'clamp(18px, 4.5vw, 20px)',
            padding: '4px',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          ⚙
        </div>

        {/* Settings dropdown */}
        {showSettings && (
          <>
            {/* Backdrop to close dropdown */}
            <div 
              onClick={() => setShowSettings(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999
              }}
            />
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              backgroundColor: 'white',
              color: '#333',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: 'clamp(120px, 25vw, 150px)',
              overflow: 'hidden',
              zIndex: 1001
            }}>
              <div 
                onClick={() => {
                  setShowSettings(false);
                  /* Add profile action */
                }}
                style={{
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                  fontSize: 'clamp(13px, 3vw, 14px)',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                Profile
              </div>
              <div 
                onClick={handleLogout}
                style={{
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                  cursor: 'pointer',
                  color: '#dc3545',
                  fontSize: 'clamp(13px, 3vw, 14px)',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#fff5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                Logout
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AppBar;
