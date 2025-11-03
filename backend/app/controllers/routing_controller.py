from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.routing_service import RoutingService
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
