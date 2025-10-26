from datetime import datetime, timedelta
from typing import List
from math import radians, sin, cos, sqrt, atan2
from ..models.ride_model import RideModel, Location, RideStatus
from ..dtos.ride_dto import NearbyRidesRequest, CreateRideRequest, UpdateRideRequest

class RideService:
    def __init__(self, db_collection):
        self.rides = db_collection

    def calculate_distance(self, loc1: Location, loc2: Location) -> float:
        """Calculate distance between two points using Haversine formula."""
        R = 6371  # Earth's radius in kilometers

        lat1, lon1 = radians(loc1.latitude), radians(loc1.longitude)
        lat2, lon2 = radians(loc2.latitude), radians(loc2.longitude)

        dlat = lat2 - lat1
        dlon = lon2 - lon1

        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        distance = R * c

        return distance

    async def find_nearby_rides(self, request: NearbyRidesRequest) -> List[RideModel]:
        """Find ride requests within specified distance and time window."""
        current_time = datetime.utcnow()
        time_threshold = current_time + timedelta(minutes=request.time_window)
        
        # Filter criteria
        base_query = {
            "status": {"$in": request.status} if request.status else {"$eq": RideStatus.PENDING},
            "pickup_time": {"$gte": current_time, "$lte": time_threshold}
        }

        # Get all potential rides within the time window
        rides = await self.rides.find(base_query).to_list(length=100)
        
        # Filter by distance and sort by proximity
        nearby_rides = []
        for ride in rides:
            distance = self.calculate_distance(request.current_location, ride.pickup_location)
            if distance <= request.max_distance:
                ride.distance_to_pickup = distance  # Add distance info for sorting
                nearby_rides.append(ride)
        
        # Sort by distance
        nearby_rides.sort(key=lambda x: x.distance_to_pickup)
        
        return nearby_rides

    async def create_ride(self, request: CreateRideRequest, passenger_id: str) -> RideModel:
        """Create a new ride request."""
        ride = RideModel(
            passenger_id=passenger_id,
            pickup_location=request.pickup_location,
            dropoff_location=request.dropoff_location,
            pickup_time=request.pickup_time,
            number_of_passengers=request.number_of_passengers,
            special_requirements=request.special_requirements,
            estimated_fare=self.calculate_estimated_fare(
                request.pickup_location,
                request.dropoff_location,
                request.number_of_passengers
            )
        )
        
        await self.rides.insert_one(ride.model_dump())
        return ride

    def calculate_estimated_fare(self, pickup: Location, dropoff: Location, passengers: int) -> float:
        """Calculate estimated fare based on distance and passengers."""
        base_fare = 50  # Base fare in rupees
        per_km_rate = 12  # Rate per kilometer
        per_person_charge = 10  # Additional charge per passenger

        distance = self.calculate_distance(pickup, dropoff)
        fare = base_fare + (distance * per_km_rate) + ((passengers - 1) * per_person_charge)
        
        return round(fare, 2)

    async def update_ride(self, ride_id: str, update: UpdateRideRequest) -> RideModel:
        """Update ride details."""
        update_data = update.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()

        result = await self.rides.update_one(
            {"_id": ride_id},
            {"$set": update_data}
        )

        if result.modified_count == 0:
            raise ValueError("Ride not found or no changes made")

        updated_ride = await self.rides.find_one({"_id": ride_id})
        return RideModel(**updated_ride)

    async def get_user_rides(self, user_id: str, status: List[RideStatus] = None) -> List[RideModel]:
        """Get all rides for a specific user with optional status filtering."""
        query = {"passenger_id": user_id}
        if status:
            query["status"] = {"$in": status}

        rides = await self.rides.find(query).to_list(length=100)
        return [RideModel(**ride) for ride in rides]

    async def cancel_ride(self, ride_id: str, user_id: str) -> RideModel:
        """Cancel a ride request."""
        ride = await self.rides.find_one({"_id": ride_id})
        if not ride:
            raise ValueError("Ride not found")
        
        if ride["passenger_id"] != user_id:
            raise ValueError("Not authorized to cancel this ride")

        if ride["status"] not in [RideStatus.PENDING, RideStatus.ACCEPTED]:
            raise ValueError(f"Cannot cancel ride in {ride['status']} status")

        update_data = {
            "status": RideStatus.CANCELLED,
            "updated_at": datetime.utcnow()
        }

        result = await self.rides.update_one(
            {"_id": ride_id},
            {"$set": update_data}
        )

        if result.modified_count == 0:
            raise ValueError("Failed to cancel ride")

        cancelled_ride = await self.rides.find_one({"_id": ride_id})
        return RideModel(**cancelled_ride)

    async def get_ride_by_id(self, ride_id: str, user_id: str) -> RideModel:
        """Get detailed information about a specific ride."""
        ride = await self.rides.find_one({"_id": ride_id})
        if not ride:
            raise ValueError("Ride not found")
        
        # For now, only allow passengers to view their own rides
        if ride["passenger_id"] != user_id:
            raise ValueError("Not authorized to view this ride")

        return RideModel(**ride)
