from datetime import datetime
from app.config import get_database
from app.models.user_model import User, UserRegistration
from app.utils.auth import hash_password
from pymongo.errors import DuplicateKeyError

class UserService:
    def __init__(self):
        self.db = get_database()
        self.users_collection = self.db.users
        
        # Create unique index on email
        self.users_collection.create_index("email", unique=True)
    
    async def create_user(self, user_data: UserRegistration) -> dict:
        """Create a new user in the database"""
        try:
            # Hash the password
            password_hash = hash_password(user_data.password)
            
            # Create user document
            user_doc = {
                "full_name": user_data.full_name,
                "email": user_data.email.lower(),  # Store email in lowercase
                "password_hash": password_hash,
                "residence_type": user_data.residence_type,
                "has_vehicle": user_data.has_vehicle,
                "vehicle_type": user_data.vehicle_type,
                "home_address": {
                    "society_hostel_name": user_data.home_address.society_hostel_name,
                    "street": user_data.home_address.street,
                    "area": user_data.home_address.area,
                    "pin_code": user_data.home_address.pin_code
                },
                "college_address": user_data.college_address,
                "created_at": datetime.utcnow(),
                "is_active": True
            }
            
            # Insert user into database
            result = self.users_collection.insert_one(user_doc)
            
            return {
                "success": True,
                "message": "User registered successfully",
                "user_id": str(result.inserted_id)
            }
            
        except DuplicateKeyError:
            return {
                "success": False,
                "message": "Email already exists"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Registration failed: {str(e)}"
            }
    
    async def check_email_exists(self, email: str) -> bool:
        """Check if email already exists in database"""
        user = self.users_collection.find_one({"email": email.lower()})
        return user is not None
    
    async def get_user_by_email(self, email: str):
        """Get user by email"""
        try:
            user = self.users_collection.find_one({"email": email.lower()})
            return user
        except Exception as e:
            print(f"Error getting user by email: {e}")
            return None
    
    async def get_user_by_id(self, user_id: str):
        """Get user by ID"""
        try:
            from bson import ObjectId
            user = self.users_collection.find_one({"_id": ObjectId(user_id)})
            return user
        except Exception as e:
            print(f"Error getting user by ID: {e}")
            return None