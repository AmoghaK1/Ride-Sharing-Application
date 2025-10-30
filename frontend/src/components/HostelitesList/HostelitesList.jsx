import React from 'react';
import RideCard from '../RideCard/RideCard';
import '../RideRequestsList/RideRequestsList.css';

const HostelitesList = ({ rides }) => {
    if (!rides || rides.length === 0) {
        return (
            <div className="no-rides">
                <p>No hostelites requesting nearby.</p>
                <small>Try adjusting your filters or check back later.</small>
            </div>
        );
    }

    return (
        <div className="ride-requests-list">
            <div className="list-header">
                <h3>Hostelites Nearby ({rides.length})</h3>
                <div className="sort-section" />
            </div>
            <div className="rides-grid">
                {rides.map((ride) => (
                    <RideCard key={ride.id} ride={ride} />
                ))}
            </div>
        </div>
    );
};

export default HostelitesList;
