from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List, Optional
from ..services.ride_service import RideService
from ..models.ride_model import RideStatus
from ..dtos.ride_dto import (
    CreateRideRequest,
    UpdateRideRequest,
    RideResponse,
    NearbyRidesRequest,
    NearbyRidesResponse,
    UserRidesResponse
)
from ..utils.auth import get_current_user
from ..utils.rate_limiter import limiter
from motor.motor_asyncio import AsyncIOMotorCollection
from ..config import get_db

router = APIRouter(prefix="/rides", tags=["Rides"])

async def get_ride_service() -> RideService:
    db = await get_db()
    return RideService(db.rides)

@router.post("/nearby", response_model=NearbyRidesResponse)
@limiter.limit("30/minute")
async def get_nearby_rides(
    request: Request,
    nearby_request: NearbyRidesRequest,
    ride_service: RideService = Depends(get_ride_service),
    current_user: dict = Depends(get_current_user)
):
    """Get nearby ride requests for riders."""
    try:
        rides = await ride_service.find_nearby_rides(nearby_request)
        return NearbyRidesResponse(
            rides=[RideResponse(**ride.dict()) for ride in rides],
            total_count=len(rides)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=RideResponse)
@limiter.limit("10/minute")
async def create_ride_request(
    request: Request,
    ride_request: CreateRideRequest,
    ride_service: RideService = Depends(get_ride_service),
    current_user: dict = Depends(get_current_user)
):
    """Create a new ride request."""
    try:
        ride = await ride_service.create_ride(ride_request, current_user["id"])
        return RideResponse(**ride.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{ride_id}", response_model=RideResponse)
@limiter.limit("20/minute")
async def update_ride_request(
    request: Request,
    ride_id: str,
    update_request: UpdateRideRequest,
    ride_service: RideService = Depends(get_ride_service),
    current_user: dict = Depends(get_current_user)
):
    """Update a ride request."""
    try:
        ride = await ride_service.update_ride(ride_id, update_request)
        return RideResponse(**ride.dict())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user", response_model=UserRidesResponse)
@limiter.limit("30/minute")
async def get_user_rides(
    request: Request,
    status: Optional[List[RideStatus]] = None,
    ride_service: RideService = Depends(get_ride_service),
    current_user: dict = Depends(get_current_user)
):
    """Get all rides for the current user with optional status filtering."""
    try:
        rides = await ride_service.get_user_rides(current_user["id"], status)
        return UserRidesResponse(
            rides=[RideResponse(**ride.dict()) for ride in rides],
            total_count=len(rides)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{ride_id}/cancel", response_model=RideResponse)
@limiter.limit("10/minute")
async def cancel_ride(
    request: Request,
    ride_id: str,
    ride_service: RideService = Depends(get_ride_service),
    current_user: dict = Depends(get_current_user)
):
    """Cancel a ride request."""
    try:
        ride = await ride_service.cancel_ride(ride_id, current_user["id"])
        return RideResponse(**ride.dict())
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{ride_id}", response_model=RideResponse)
@limiter.limit("30/minute")
async def get_ride_by_id(
    request: Request,
    ride_id: str,
    ride_service: RideService = Depends(get_ride_service),
    current_user: dict = Depends(get_current_user)
):
    """Get detailed information about a specific ride."""
    try:
        ride = await ride_service.get_ride_by_id(ride_id, current_user["id"])
        return RideResponse(**ride.dict())
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
