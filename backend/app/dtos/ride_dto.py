from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from ..models.ride_model import RideStatus, Location

class CreateRideRequest(BaseModel):
    pickup_location: Location
    dropoff_location: Location
    pickup_time: datetime
    number_of_passengers: int = Field(ge=1, le=4)
    special_requirements: Optional[str] = None

class UpdateRideRequest(BaseModel):
    status: Optional[RideStatus] = None
    pickup_time: Optional[datetime] = None
    number_of_passengers: Optional[int] = Field(None, ge=1, le=4)
    special_requirements: Optional[str] = None

class RideResponse(BaseModel):
    id: str
    passenger_id: str
    pickup_location: Location
    dropoff_location: Location
    requested_time: datetime
    pickup_time: datetime
    status: RideStatus
    number_of_passengers: int
    estimated_fare: float
    special_requirements: Optional[str]
    created_at: datetime
    updated_at: datetime

class NearbyRidesRequest(BaseModel):
    current_location: Location
    max_distance: float = Field(ge=0, le=50)  # Maximum distance in kilometers
    time_window: int = Field(ge=0, le=120)    # Time window in minutes
    status: Optional[List[RideStatus]] = None  # Filter by specific statuses

class NearbyRidesResponse(BaseModel):
    rides: List[RideResponse]
    total_count: int

class UserRidesResponse(BaseModel):
    rides: List[RideResponse]
    total_count: int
