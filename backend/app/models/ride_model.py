from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId
from enum import Enum

class RideStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Location(BaseModel):
    latitude: float
    longitude: float
    address: str

class RideModel(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()))
    passenger_id: str
    pickup_location: Location
    dropoff_location: Location
    requested_time: datetime = Field(default_factory=datetime.utcnow)
    pickup_time: datetime
    status: RideStatus = RideStatus.PENDING
    number_of_passengers: int = Field(ge=1, le=4)
    estimated_fare: float
    special_requirements: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "passenger_id": "user123",
                "pickup_location": {
                    "latitude": 12.9716,
                    "longitude": 77.5946,
                    "address": "MG Road, Bangalore"
                },
                "dropoff_location": {
                    "latitude": 13.0827,
                    "longitude": 77.5877,
                    "address": "Hebbal, Bangalore"
                },
                "pickup_time": "2025-10-24T15:30:00",
                "number_of_passengers": 2,
                "estimated_fare": 250.00,
                "special_requirements": "Luggage space needed"
            }
        }