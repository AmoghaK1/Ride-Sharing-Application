import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RideFilters from '../RideFilters/RideFilters';
import RideRequestsList from '../RideRequestsList/RideRequestsList';
import './RiderDashboard.css';

const RiderDashboard = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        distance: 10,
        timeWindow: 60,
        status: 'pending'
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchNearbyRides();
    }, [filters]);

    const fetchNearbyRides = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get user's location
            const position = await getCurrentPosition();
            
            const response = await fetch('http://localhost:8000/rides/nearby', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    current_location: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        address: "Current Location" // You might want to reverse geocode this
                    },
                    max_distance: filters.distance,
                    time_window: filters.timeWindow,
                    status: [filters.status]
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch rides');
            }

            const data = await response.json();
            setRides(data.rides);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching rides:', err);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentPosition = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
            } else {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            }
        });
    };

    if (loading) {
        return <div className="loading">Loading available rides...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="rider-dashboard">
            <h1>Available Rides</h1>
            <div className="dashboard-content">
                <div className="filters-section">
                    <RideFilters filters={filters} onFilterChange={setFilters} />
                </div>
                
                <div className="rides-section">
                    <RideRequestsList rides={rides} />
                </div>
            </div>
        </div>
    );
};

export default RiderDashboard;