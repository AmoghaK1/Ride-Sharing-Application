import React, { useEffect, useState } from 'react';
import './CorridorMatchingDemo.css';

/**
 * Geometric Corridor Matching Algorithm Visualization
 * 
 * Algorithm Name: "Geometric Corridor Matching with Greedy Selection"
 * Also known as: "Point-to-Path Proximity Algorithm with Greedy Optimization"
 * 
 * This algorithm combines concepts from:
 * 1. Computational Geometry (point-to-line distance calculations)
 * 2. Greedy Algorithms (local optimization for selection)
 * 3. Spatial Indexing (geographic proximity matching)
 * 
 * It's NOT named after famous algorithms like Dijkstra or Knapsack, but uses
 * similar optimization principles from greedy algorithm design patterns.
 */

const CorridorMatchingDemo = () => {
    const [simulationData, setSimulationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);

    const algorithmSteps = [
        "🚗 Rider provides route from home to college",
        "📍 Create geometric corridor around route path", 
        "👥 Find all hostelites within corridor width",
        "📏 Calculate point-to-line distances",
        "🎯 Apply greedy selection (route order + distance)",
        "✅ Return optimized pickup sequence"
    ];

    useEffect(() => {
        fetchSimulationData();
    }, []);

    const fetchSimulationData = async () => {
        try {
            const response = await fetch('/api/routing/simulate-corridor-matching');
            const data = await response.json();
            setSimulationData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching simulation:', error);
            setLoading(false);
        }
    };

    const nextStep = () => {
        setCurrentStep(prev => (prev + 1) % algorithmSteps.length);
    };

    if (loading) {
        return (
            <div className="demo-container">
                <div className="loading">🔄 Loading corridor matching simulation...</div>
            </div>
        );
    }

    if (!simulationData) {
        return (
            <div className="demo-container">
                <div className="error">❌ Failed to load simulation data</div>
            </div>
        );
    }

    return (
        <div className="demo-container">
            <div className="demo-header">
                <h2>🧮 Geometric Corridor Matching Algorithm</h2>
                <div className="algorithm-info">
                    <p><strong>Algorithm Type:</strong> Point-to-Path Proximity with Greedy Selection</p>
                    <p><strong>Time Complexity:</strong> O(n×m) where n=hostelites, m=route points</p>
                    <p><strong>Space Complexity:</strong> O(n) for storing matches</p>
                </div>
            </div>

            <div className="demo-content">
                <div className="algorithm-steps">
                    <h3>📋 Algorithm Steps:</h3>
                    {algorithmSteps.map((step, index) => (
                        <div 
                            key={index} 
                            className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                        >
                            <span className="step-number">{index + 1}</span>
                            <span className="step-text">{step}</span>
                        </div>
                    ))}
                    <button onClick={nextStep} className="next-step-btn">
                        Next Step →
                    </button>
                </div>

                <div className="simulation-results">
                    <h3>🎯 Simulation Results:</h3>
                    <div className="stats">
                        <div className="stat">
                            <span className="stat-label">Route Points:</span>
                            <span className="stat-value">{simulationData.data.route_points}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Total Matches:</span>
                            <span className="stat-value">{simulationData.data.total_matches}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Selected:</span>
                            <span className="stat-value">{simulationData.data.selected_matches}</span>
                        </div>
                    </div>

                    <div className="matches-list">
                        <h4>✅ Optimal Matches (Greedy Selection):</h4>
                        {simulationData.data.matches.map((match, index) => (
                            <div key={index} className="match-card">
                                <div className="match-header">
                                    <span className="pickup-order">#{match.pickup_order}</span>
                                    <span className="hostelite-name">{match.hostelite_name}</span>
                                </div>
                                <div className="match-details">
                                    <div className="detail">
                                        <span className="detail-label">📍 Location:</span>
                                        <span className="detail-value">
                                            ({match.hostelite_location.lat.toFixed(4)}, {match.hostelite_location.lng.toFixed(4)})
                                        </span>
                                    </div>
                                    <div className="detail">
                                        <span className="detail-label">📏 Distance from route:</span>
                                        <span className="detail-value">{match.distance_from_route_meters}m</span>
                                    </div>
                                    <div className="detail">
                                        <span className="detail-label">⏰ Pickup time:</span>
                                        <span className="detail-value">+{match.estimated_pickup_time_minutes} min</span>
                                    </div>
                                    <div className="detail">
                                        <span className="detail-label">📞 Contact:</span>
                                        <span className="detail-value">{match.phone}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="algorithm-explanation">
                <h3>🤔 Why is this algorithm effective?</h3>
                <div className="explanation-points">
                    <div className="point">
                        <strong>1. Geometric Efficiency:</strong> Uses computational geometry to find exact point-to-line distances, ensuring accurate corridor detection.
                    </div>
                    <div className="point">
                        <strong>2. Greedy Optimization:</strong> Prioritizes early route positions to minimize detours and travel time.
                    </div>
                    <div className="point">
                        <strong>3. Real-time Performance:</strong> O(n×m) complexity allows real-time matching even with hundreds of hostelites.
                    </div>
                    <div className="point">
                        <strong>4. Practical Constraints:</strong> Considers destination similarity and capacity limits for realistic ride sharing.
                    </div>
                </div>
            </div>

            <div className="comparison">
                <h3>📊 Algorithm Classification:</h3>
                <p>This algorithm is <strong>NOT</strong> a variant of famous algorithms like:</p>
                <ul>
                    <li>❌ Dijkstra's Algorithm (shortest path finding)</li>
                    <li>❌ Knapsack Problem (optimization with weight constraints)</li>
                    <li>❌ A* Algorithm (heuristic pathfinding)</li>
                </ul>
                <p>Instead, it's a <strong>custom geometric algorithm</strong> that combines:</p>
                <ul>
                    <li>✅ Point-in-Polygon/Corridor detection (Computational Geometry)</li>
                    <li>✅ Greedy Selection Strategy (Algorithm Design Pattern)</li>
                    <li>✅ Spatial Proximity Matching (Geographic Information Systems)</li>
                </ul>
            </div>
        </div>
    );
};

export default CorridorMatchingDemo;