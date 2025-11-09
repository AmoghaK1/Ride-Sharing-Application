from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.routing_service import RoutingService
from app.services.corridor_matching_service import simulate_corridor_matching, GeometricCorridorMatcher, Point, Hostelite
from app.config import get_settings
import os
import httpx

router = APIRouter(prefix="/routing", tags=["Routing"])

class Location(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

class ShortestPathRequest(BaseModel):
    start_location: Location

class ShortestPathResponse(BaseModel):
    start_node: str
    end_node: str
    distance_km: float
    nodes: list[str]
    path: list[list[float]]  # [[lat,lng], ...]

# Initialize service with data dir
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
settings = get_settings()
routing_service = RoutingService(DATA_DIR, college_lat=settings.COLLEGE_LAT, college_lng=settings.COLLEGE_LNG)

def generate_realistic_hostelites(route_points: list[Point], destination: Point) -> list[Hostelite]:
    """Generate hostelites near the actual route path"""
    import random
    
    hostelites = []
    names = ["Rahul Sharma", "Priya Patel", "Arjun Kumar", "Sneha Gupta", "Amit Singh"]
    phones = ["+91-9876543210", "+91-9876543211", "+91-9876543212", "+91-9876543213", "+91-9876543214"]
    
    # Work with routes of any length >= 3 points
    if len(route_points) >= 3:
        # For shorter routes, just use available points
        if len(route_points) <= 6:
            indices = list(range(1, len(route_points) - 1))  # Exclude start/end
        else:
            indices = [
                len(route_points) // 4,      # 25% along route
                len(route_points) // 2,      # 50% along route  
                3 * len(route_points) // 4   # 75% along route
            ]
        
        for i, route_idx in enumerate(indices[:3]):  # Max 3 hostelites
            if route_idx < len(route_points) and route_idx > 0:
                base_point = route_points[route_idx]
                
                # Add random offset within 500m of route point
                lat_offset = random.uniform(-0.003, 0.003)  # ~300m at Pune latitude
                lng_offset = random.uniform(-0.003, 0.003)
                
                hostelite = Hostelite(
                    id=f"h{i+1:03d}",
                    name=names[i % len(names)],
                    lat=base_point.lat + lat_offset,
                    lng=base_point.lng + lng_offset,
                    destination=destination,
                    phone=phones[i % len(phones)]
                )
                hostelites.append(hostelite)
    
    return hostelites

@router.post("/shortest-path", response_model=ShortestPathResponse)
async def shortest_path(req: ShortestPathRequest):
    try:
        # Use configured college location
        res = routing_service.shortest_path_to_college(
            start_lat=req.start_location.latitude,
            start_lng=req.start_location.longitude
        )
        if not res["nodes"]:
            raise HTTPException(status_code=404, detail="No route found")
        return res
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/college-location")
async def college_location():
    """Return configured college lat/lng so clients can show a marker."""
    return {"latitude": settings.COLLEGE_LAT, "longitude": settings.COLLEGE_LNG}


@router.post("/shortest-path-osrm")
async def shortest_path_osrm(req: ShortestPathRequest):
    """Compute a driving route using the public OSRM service and return a geojson-style path list [[lat,lng], ...]."""
    try:
        start_lat = req.start_location.latitude
        start_lng = req.start_location.longitude
        end_lat = settings.COLLEGE_LAT
        end_lng = settings.COLLEGE_LNG

        coords = f"{start_lng},{start_lat};{end_lng},{end_lat}"
        url = f"https://router.project-osrm.org/route/v1/driving/{coords}"
        params = {"overview": "full", "geometries": "geojson"}

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()
        if not data.get("routes"):
            raise HTTPException(status_code=404, detail="No route returned from OSRM")
        route = data["routes"][0]
        distance_km = route.get("distance", 0) / 1000.0
        coords_lnglat = route["geometry"]["coordinates"]  # [[lng,lat], ...]
        path = [[lat, lng] for lng, lat in coords_lnglat]
        return {"start_node": None, "end_node": None, "distance_km": round(distance_km, 3), "nodes": [], "path": path}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/simulate-corridor-matching")
async def simulate_corridor_matching_api():
    """
    Simulate the Geometric Corridor Matching Algorithm with dummy data
    Shows how the algorithm finds hostelites along a rider's route
    """
    try:
        result = simulate_corridor_matching()
        return {
            "success": True,
            "algorithm_name": "Geometric Corridor Matching with Greedy Selection",
            "description": "Point-to-Path Proximity Algorithm with Greedy Optimization",
            "data": {
                "route_points": len(result["route"]),
                "total_matches": len(result["all_matches"]),
                "selected_matches": len(result["selected_matches"]),
                "matches": [
                    {
                        "hostelite_name": match.hostelite.name,
                        "hostelite_location": {
                            "lat": match.hostelite.lat,
                            "lng": match.hostelite.lng
                        },
                        "distance_from_route_meters": round(match.distance_from_route, 1),
                        "pickup_point": {
                            "lat": match.pickup_point.lat,
                            "lng": match.pickup_point.lng
                        },
                        "route_index": match.route_index,
                        "pickup_order": match.pickup_order,
                        "estimated_pickup_time_minutes": match.estimated_pickup_time_minutes,
                        "phone": match.hostelite.phone
                    }
                    for match in result["selected_matches"]
                ],
                "route": [
                    {"lat": point.lat, "lng": point.lng} 
                    for point in result["route"]
                ]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

class CorridorMatchRequest(BaseModel):
    route_points: list[Location]
    rider_destination: Location
    corridor_width_meters: float = Field(default=1000, ge=100, le=5000)

@router.post("/find-corridor-matches")
async def find_corridor_matches(req: CorridorMatchRequest):
    """
    Find hostelites within a corridor around the rider's route
    Uses the Geometric Corridor Matching Algorithm
    """
    try:
        # Convert to internal format
        route = [Point(lat=loc.latitude, lng=loc.longitude) for loc in req.route_points]
        destination = Point(lat=req.rider_destination.latitude, lng=req.rider_destination.longitude)
        
        # Create matcher with specified corridor width
        matcher = GeometricCorridorMatcher(corridor_width_meters=req.corridor_width_meters)
        
        # Generate realistic hostelites near the actual route
        college_dest = Point(lat=req.rider_destination.latitude, lng=req.rider_destination.longitude)
        dummy_hostelites = generate_realistic_hostelites(route, college_dest)
        
        # Find matches
        matches = matcher.find_corridor_matches(route, dummy_hostelites, destination)
        optimal_matches = matcher.select_optimal_matches(matches, max_capacity=3)
        
        return {
            "success": True,
            "corridor_width_meters": req.corridor_width_meters,
            "total_hostelites_checked": len(dummy_hostelites),
            "matches_found": len(matches),
            "optimal_matches_selected": len(optimal_matches),
            "matches": [
                {
                    "hostelite_id": match.hostelite.id,
                    "hostelite_name": match.hostelite.name,
                    "location": {"lat": match.hostelite.lat, "lng": match.hostelite.lng},
                    "distance_from_route": round(match.distance_from_route, 1),
                    "pickup_point": {"lat": match.pickup_point.lat, "lng": match.pickup_point.lng},
                    "pickup_order": match.pickup_order,
                    "estimated_time": match.estimated_pickup_time_minutes
                }
                for match in optimal_matches
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching failed: {str(e)}")

@router.get("/graph")
async def campus_graph():
    """Return the campus graph (nodes and edges) so clients can visualize the network."""
    graph_path = os.path.join(DATA_DIR, 'campus_graph.json')
    if not os.path.exists(graph_path):
        raise HTTPException(status_code=404, detail="Campus graph not found")
    try:
        with open(graph_path, 'r', encoding='utf-8') as f:
            data = f.read()
        # return raw JSON parsed by FastAPI
        from fastapi.responses import JSONResponse
        import json as _json
        return JSONResponse(content=_json.loads(data))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
