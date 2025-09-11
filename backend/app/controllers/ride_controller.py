# Ride controller - handles HTTP requests and routes
from fastapi import APIRouter
from app.services.ride_service import get_sample_match

router = APIRouter(prefix="/rides", tags=["Rides"])

@router.get("/match")
def match_rides():
    return {"result": get_sample_match()}
