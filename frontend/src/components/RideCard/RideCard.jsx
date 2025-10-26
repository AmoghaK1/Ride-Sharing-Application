import React from 'react';
import './RideCard.css';

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
            const response = await fetch(`http://localhost:8000/rides/${ride.id}`, {
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

    return (
        <div className="ride-card">
            <div className="ride-header">
                <span className={`status-badge ${ride.status}`}>{ride.status}</span>
                <span className="ride-fare">₹{ride.estimated_fare}</span>
            </div>

            <div className="ride-details">
                <div className="location-info">
                    <div className="pickup">
                        <label>Pickup</label>
                        <p>{ride.pickup_location.address}</p>
                    </div>
                    <div className="dropoff">
                        <label>Dropoff</label>
                        <p>{ride.dropoff_location.address}</p>
                    </div>
                </div>

                <div className="time-info">
                    <div className="date">{date}</div>
                    <div className="time">{time}</div>
                </div>

                <div className="passenger-info">
                    <span className="passengers">
                        <i className="fas fa-user"></i> {ride.number_of_passengers} passenger(s)
                    </span>
                </div>

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
                        Accept Ride
                    </button>
                )}
                <button className="details-button">View Details</button>
            </div>
        </div>
    );
};

export default RideCard;