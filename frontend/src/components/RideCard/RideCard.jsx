import React from 'react';
import './RideCard.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchWithFallback } from '../../constants/api';

const RideCard = ({ ride }) => {
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),
            time: date.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const { date, time } = formatDateTime(ride.pickup_time);

    const handleAcceptRide = async () => {
        try {
            const response = await fetchWithFallback(`/rides/${ride.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    status: 'accepted'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to accept ride');
            }

            // Handle successful acceptance (you might want to refresh the ride list)
            alert('Ride accepted successfully!');
        } catch (error) {
            console.error('Error accepting ride:', error);
            alert('Failed to accept ride. Please try again.');
        }
    };

    const passengerName = ride.passenger_name || ride.passenger_id || 'Student';
    const pickupAddress = ride.pickup_location?.address || 'Unknown location';
    const pickupLat = ride.pickup_location?.latitude;
    const pickupLng = ride.pickup_location?.longitude;

    return (
        <div className="ride-card">
            <div className="ride-header">
                <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700 }}>{passengerName}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>{pickupAddress}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span className={`status-badge ${ride.status}`}>{ride.status}</span>
                </div>
            </div>

            <div className="ride-details">
                <div className="time-info">
                    <div className="date">{date}</div>
                    <div className="time">{time}</div>
                </div>

                {pickupLat && pickupLng && (
                    <div style={{ height: 160, width: '100%', borderRadius: 6, overflow: 'hidden', border: '1px solid #eee' }}>
                        <MapContainer
                            center={[pickupLat, pickupLng]}
                            zoom={16}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={false}
                            attributionControl={false}
                            zoomControl={false}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[pickupLat, pickupLng]} />
                        </MapContainer>
                    </div>
                )}

                {ride.special_requirements && (
                    <div className="special-requirements">
                        <label>Special Requirements:</label>
                        <p>{ride.special_requirements}</p>
                    </div>
                )}
            </div>

            <div className="ride-actions">
                {ride.status === 'pending' && (
                    <button className="accept-button" onClick={handleAcceptRide}>
                        Accept Ride Request
                    </button>
                )}
            </div>
        </div>
    );
};

export default RideCard;