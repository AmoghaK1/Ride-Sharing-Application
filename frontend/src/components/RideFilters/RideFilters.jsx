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

            <button 
                className="clear-filters"
                onClick={() => onFilterChange({
                    distance: 10
                })}
            >
                Clear Filters
            </button>
        </div>
    );
};

export default RideFilters;