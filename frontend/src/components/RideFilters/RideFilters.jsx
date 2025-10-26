import React from 'react';
import './RideFilters.css';

const RideFilters = ({ filters, onFilterChange }) => {
    const handleFilterChange = (name, value) => {
        onFilterChange({
            ...filters,
            [name]: value
        });
    };

    return (
        <div className="ride-filters">
            <h2>Filters</h2>
            
            <div className="filter-group">
                <label htmlFor="distance">Maximum Distance</label>
                <select
                    id="distance"
                    value={filters.distance}
                    onChange={(e) => handleFilterChange('distance', Number(e.target.value))}
                >
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                    <option value={20}>20 km</option>
                    <option value={50}>50 km</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="timeWindow">Time Window</label>
                <select
                    id="timeWindow"
                    value={filters.timeWindow}
                    onChange={(e) => handleFilterChange('timeWindow', Number(e.target.value))}
                >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="status">Ride Status</label>
                <select
                    id="status"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="all">All</option>
                </select>
            </div>

            <button 
                className="clear-filters"
                onClick={() => onFilterChange({
                    distance: 10,
                    timeWindow: 60,
                    status: 'pending'
                })}
            >
                Clear Filters
            </button>
        </div>
    );
};

export default RideFilters;