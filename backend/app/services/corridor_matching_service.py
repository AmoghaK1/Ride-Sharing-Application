"""
Geometric Corridor Matching Algorithm with Greedy Selection

This algorithm is formally known as:
1. Point-to-Path Proximity Algorithm (for finding nearby points)
2. Greedy Selection Algorithm (for optimization)
3. Corridor-based Spatial Matching (overall approach)

It combines concepts from:
- Computational Geometry (point-to-line distance)
- Greedy Algorithms (local optimization)
- Spatial Indexing (geographic proximity)

Time Complexity: O(n * m) where n = number of hostelites, m = number of route points
Space Complexity: O(n) for storing matches
"""

from __future__ import annotations
from dataclasses import dataclass
from typing import Dict, List, Tuple, Optional
from math import radians, sin, cos, sqrt, atan2, degrees, atan
import json

@dataclass
class Point:
    lat: float
    lng: float
    
@dataclass 
class Hostelite:
    id: str
    name: str
    lat: float
    lng: float
    destination: Point
    phone: str
    
@dataclass
class CorridorMatch:
    hostelite: Hostelite
    distance_from_route: float  # meters
    pickup_point: Point
    route_index: int
    pickup_order: int
    estimated_pickup_time_minutes: float

class GeometricCorridorMatcher:
    """
    Implements the Geometric Corridor Matching Algorithm
    
    This is a greedy algorithm that:
    1. Creates a geometric corridor around the route path
    2. Finds all points (hostelites) within this corridor
    3. Greedily selects optimal matches based on:
       - Distance from route (closer is better)
       - Position on route (earlier pickup preferred)
       - Destination similarity
    """
    
    def __init__(self, corridor_width_meters: float = 1000):
        self.corridor_width = corridor_width_meters
        self.earth_radius_km = 6371.0
        
    def haversine_distance(self, p1: Point, p2: Point) -> float:
        """Calculate great circle distance between two points in meters"""
        R = self.earth_radius_km * 1000  # Convert to meters
        lat1, lon1, lat2, lon2 = map(radians, [p1.lat, p1.lng, p2.lat, p2.lng])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        h = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(h), sqrt(1 - h))
        return R * c
    
    def point_to_line_segment_distance(self, point: Point, line_start: Point, line_end: Point) -> Tuple[float, Point]:
        """
        Calculate the shortest distance from a point to a line segment
        Returns: (distance_in_meters, closest_point_on_segment)
        
        This uses the perpendicular distance formula from computational geometry
        """
        # Convert to a local coordinate system for easier calculation
        A = point.lat - line_start.lat
        B = point.lng - line_start.lng
        C = line_end.lat - line_start.lat
        D = line_end.lng - line_start.lng
        
        dot_product = A * C + B * D
        length_squared = C * C + D * D
        
        if length_squared == 0:  # Line segment is actually a point
            return self.haversine_distance(point, line_start), line_start
        
        # Parameter t represents position along the line segment (0 to 1)
        t = max(0, min(1, dot_product / length_squared))
        
        # Find the closest point on the line segment
        closest_point = Point(
            lat=line_start.lat + t * C,
            lng=line_start.lng + t * D
        )
        
        distance = self.haversine_distance(point, closest_point)
        return distance, closest_point
    
    def find_corridor_matches(self, route_points: List[Point], hostelites: List[Hostelite], 
                            rider_destination: Point) -> List[CorridorMatch]:
        """
        Main algorithm: Geometric Corridor Matching with Greedy Selection
        
        Algorithm Steps:
        1. For each hostelite, find closest point on route
        2. Check if hostelite is within corridor width
        3. Verify destination compatibility
        4. Create match with metrics for greedy selection
        
        Greedy Strategy: Select based on route order first, then distance
        """
        matches = []
        
        for hostelite in hostelites:
            hostelite_point = Point(hostelite.lat, hostelite.lng)
            
            # Skip if destination is too different (> 2km from rider's destination)
            if self.haversine_distance(hostelite.destination, rider_destination) > 2000:
                continue
            
            # Find closest point on entire route
            min_distance = float('inf')
            best_pickup_point = None
            best_route_index = -1
            
            for i in range(len(route_points) - 1):
                segment_start = route_points[i]
                segment_end = route_points[i + 1]
                
                distance, closest_point = self.point_to_line_segment_distance(
                    hostelite_point, segment_start, segment_end
                )
                
                if distance < min_distance:
                    min_distance = distance
                    best_pickup_point = closest_point
                    best_route_index = i
            
            # Check if hostelite is within corridor
            if min_distance <= self.corridor_width:
                match = CorridorMatch(
                    hostelite=hostelite,
                    distance_from_route=min_distance,
                    pickup_point=best_pickup_point,
                    route_index=best_route_index,
                    pickup_order=0,  # Will be set during greedy selection
                    estimated_pickup_time_minutes=best_route_index * 2  # 2 min per segment estimate
                )
                matches.append(match)
        
        # Greedy Selection: Sort by route position first, then by distance
        matches.sort(key=lambda m: (m.route_index, m.distance_from_route))
        
        # Assign pickup orders
        for i, match in enumerate(matches):
            match.pickup_order = i + 1
            
        return matches
    
    def select_optimal_matches(self, matches: List[CorridorMatch], max_capacity: int = 3) -> List[CorridorMatch]:
        """
        Greedy selection with capacity constraint
        Already sorted by optimal order, so just take first N
        """
        return matches[:max_capacity]

class CorridorMatchingSimulator:
    """
    Simulator for testing the corridor matching algorithm with dummy data
    """
    
    def __init__(self):
        self.matcher = GeometricCorridorMatcher(corridor_width_meters=1000)
        
    def create_dummy_route(self) -> List[Point]:
        """Create a dummy route similar to the one shown in the map (Pune area)"""
        return [
            Point(lat=18.5600, lng=73.8567),  # Starting point (North Pune)
            Point(lat=18.5500, lng=73.8500),  # Route point 1
            Point(lat=18.5400, lng=73.8450),  # Route point 2  
            Point(lat=18.5350, lng=73.8420),  # Route point 3
            Point(lat=18.5300, lng=73.8400),  # Route point 4
            Point(lat=18.5250, lng=73.8380),  # Route point 5
            Point(lat=18.5200, lng=73.8350),  # Route point 6
            Point(lat=18.5150, lng=73.8320),  # Route point 7
            Point(lat=18.5100, lng=73.8300),  # College destination
        ]
    
    def create_dummy_hostelites(self) -> List[Hostelite]:
        """Create 3 dummy hostelites with different positions relative to route"""
        college_destination = Point(lat=18.5100, lng=73.8300)
        
        return [
            # Hostelite 1: Very close to route, early pickup
            Hostelite(
                id="h001",
                name="Rahul Sharma", 
                lat=18.5480,  # Close to route point 2
                lng=73.8445,
                destination=college_destination,
                phone="+91-9876543210"
            ),
            
            # Hostelite 2: Moderate distance from route, middle pickup
            Hostelite(
                id="h002", 
                name="Priya Patel",
                lat=18.5280,  # Near route point 4, but bit further
                lng=73.8450,
                destination=college_destination,
                phone="+91-9876543211"
            ),
            
            # Hostelite 3: Edge of corridor, late pickup  
            Hostelite(
                id="h003",
                name="Arjun Kumar",
                lat=18.5180,  # Near route point 6, at corridor edge
                lng=73.8280,
                destination=college_destination, 
                phone="+91-9876543212"
            )
        ]
    
    def run_simulation(self) -> Dict:
        """Run the complete corridor matching simulation"""
        print("🚗 Running Geometric Corridor Matching Algorithm Simulation")
        print("=" * 60)
        
        # Create dummy data
        route = self.create_dummy_route()
        hostelites = self.create_dummy_hostelites()
        rider_destination = Point(lat=18.5100, lng=73.8300)  # College
        
        print(f"📍 Route has {len(route)} points")
        print(f"👥 Testing with {len(hostelites)} hostelites")
        print(f"🎯 Corridor width: {self.matcher.corridor_width}m")
        print()
        
        # Find matches
        matches = self.matcher.find_corridor_matches(route, hostelites, rider_destination)
        
        print("🔍 Algorithm Results:")
        print("-" * 30)
        
        if not matches:
            print("❌ No hostelites found within corridor")
            return {"matches": [], "route": route}
        
        for i, match in enumerate(matches, 1):
            print(f"Match {i}: {match.hostelite.name}")
            print(f"  📍 Location: ({match.hostelite.lat:.4f}, {match.hostelite.lng:.4f})")
            print(f"  📏 Distance from route: {match.distance_from_route:.1f}m")
            print(f"  🚩 Pickup point: ({match.pickup_point.lat:.4f}, {match.pickup_point.lng:.4f})")
            print(f"  📊 Route index: {match.route_index}")
            print(f"  ⏰ Est. pickup time: {match.estimated_pickup_time_minutes:.1f} min from start")
            print(f"  📞 Phone: {match.hostelite.phone}")
            print()
        
        # Select optimal matches with capacity constraint
        optimal_matches = self.matcher.select_optimal_matches(matches, max_capacity=3)
        
        print("✅ Final Selected Matches (Greedy Optimization):")
        print("-" * 45)
        for match in optimal_matches:
            print(f"🎯 Pickup #{match.pickup_order}: {match.hostelite.name}")
            print(f"   Distance: {match.distance_from_route:.1f}m | Time: +{match.estimated_pickup_time_minutes:.1f}min")
        
        return {
            "route": route,
            "all_matches": matches,
            "selected_matches": optimal_matches,
            "algorithm_name": "Geometric Corridor Matching with Greedy Selection"
        }

# Export for use in other modules
def simulate_corridor_matching():
    """Main function to run the simulation"""
    simulator = CorridorMatchingSimulator()
    return simulator.run_simulation()

if __name__ == "__main__":
    simulate_corridor_matching()