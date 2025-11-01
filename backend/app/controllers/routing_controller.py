from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.routing_service import RoutingService
import os

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
routing_service = RoutingService(DATA_DIR)

@router.post("/shortest-path", response_model=ShortestPathResponse)
async def shortest_path(req: ShortestPathRequest):
    try:
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
