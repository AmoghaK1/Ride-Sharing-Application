import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RideFilters from '../RideFilters/RideFilters';
import HostelitesList from '../HostelitesList/HostelitesList';
import './RiderDashboard.css';

const RiderDashboard = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        distance: 10,
        timeWindow: 60
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
                    time_window: filters.timeWindow
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
            let ridesData = data.rides || [];

            // Dev-only: if there are no rides, inject a mock ride so designers/devs can see the UI
            // Uses Vite env flag available as import.meta.env.DEV
            if ((import.meta.env && import.meta.env.DEV) && (!ridesData || ridesData.length === 0)) {
                const mockRide = {
                    id: 'mock-1',
                    passenger_id: 'student123',
                    passenger_name: 'Asha Kumar',
                    pickup_location: { address: 'Hostel A, Block 3', latitude: position.coords.latitude, longitude: position.coords.longitude },
                    dropoff_location: { address: 'College Main Gate', latitude: position.coords.latitude + 0.01, longitude: position.coords.longitude + 0.01 },
                    pickup_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
                    requested_time: new Date().toISOString(),
                    status: 'pending',
                    number_of_passengers: 1,
                    estimated_fare: 80.0,
                    special_requirements: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                ridesData = [mockRide];
            }

            setRides(ridesData);
        } catch (err) {
            console.error('Error fetching rides:', err);
            // In dev, gracefully fall back to mock ride so UI can be inspected
            if (import.meta.env && import.meta.env.DEV) {
                const mockRide = {
                    id: 'mock-1',
                    passenger_id: 'student123',
                    passenger_name: 'Asha Kumar',
                    pickup_location: { address: 'Hostel A, Block 3' },
                    dropoff_location: { address: 'College Main Gate' },
                    pickup_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
                    requested_time: new Date().toISOString(),
                    status: 'pending',
                    number_of_passengers: 1,
                    estimated_fare: 80.0,
                    special_requirements: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                setRides([mockRide]);
                setError(null);
            } else {
                setError(err.message);
            }
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
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <h1>Available Rides</h1>
                <button onClick={() => navigate('/rider/route')} style={{padding:'0.5rem 1rem',border:'1px solid #ddd',borderRadius:6,cursor:'pointer',background:'#fff'}}>
                    View Route to College
                </button>
            </div>
            <div className="dashboard-content">
                <div className="filters-section">
                    <RideFilters filters={filters} onFilterChange={setFilters} />
                </div>
                
                <div className="rides-section">
                    <HostelitesList rides={rides} />
                </div>
            </div>
        </div>
    );
};

export default RiderDashboard;