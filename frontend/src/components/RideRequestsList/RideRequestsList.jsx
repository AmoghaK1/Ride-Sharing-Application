import React from 'react';
import RideCard from '../RideCard/RideCard';
import './RideRequestsList.css';

const RideRequestsList = ({ rides }) => {
    if (!rides || rides.length === 0) {
        return (
            <div className="no-rides">
                <p>No rides available matching your criteria.</p>
                <small>Try adjusting your filters or check back later.</small>
            </div>
        );
    }

    return (
        <div className="ride-requests-list">
            <div className="list-header">
                <h3>Available Rides ({rides.length})</h3>
                <div className="sort-section">
                    {/* Add sorting options here if needed */}
                </div>
            </div>
            <div className="rides-grid">
                {rides.map((ride) => (
                    <RideCard key={ride.id} ride={ride} />
                ))}
            </div>
        </div>
    );
};

export default RideRequestsList;