import { useState, useEffect } from 'react';
import Button from './Button';
import InputField from './InputField';
import { fetchWithFallback } from '../constants/api';

function RequestForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    requestedTime: '',
    notes: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetchWithFallback('/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const user = data.user;
          
          // Format the address from user's home_address
          let defaultAddress = '';
          if (user.home_address) {
            const addr = user.home_address;
            defaultAddress = `${addr.society_hostel_name}, ${addr.street}, ${addr.area}, ${addr.pin_code}`;
          }

          // Set today's date and current time for the datetime-local input
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const defaultDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

          setFormData(prev => ({
            ...prev,
            pickupLocation: defaultAddress,
            requestedTime: defaultDateTime
          }));
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

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
      <h2 style={{ 
        marginTop: 0, 
        marginBottom: '24px',
        color: '#374151',
        fontSize: 'clamp(20px, 4vw, 24px)',
        fontWeight: '600',
        textAlign: 'center'
      }}>
        Request Your Ride
      </h2>

      <form onSubmit={handleSubmit}>
        <InputField
          label="Pickup Location"
          type="text"
          name="pickupLocation"
          placeholder="Your address will be auto-filled (editable)"
          value={formData.pickupLocation}
          onChange={handleChange}
          required
        />

        <InputField
          label="Pickup Date & Time"
          type="datetime-local"
          name="requestedTime"
          value={formData.requestedTime}
          onChange={handleChange}
          required
        />

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#374151',
            fontSize: 'clamp(14px, 3.5vw, 16px)'
          }}>
            Additional Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special requirements or notes..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        <Button 
          type="submit" 
          variant="primary"
          style={{
            backgroundColor: '#3b82f6',
            fontSize: 'clamp(15px, 3.5vw, 16px)',
            padding: '14px',
            borderRadius: '6px',
            width: '100%'
          }}
        >
          Submit Request
        </Button>
      </form>
    </div>
  );
}

export default RequestForm;
