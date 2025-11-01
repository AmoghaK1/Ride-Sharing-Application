# Database connection and settings configuration
import os
import motor.motor_asyncio
from dotenv import load_dotenv
from functools import lru_cache

# Load environment variables
load_dotenv()

class Settings:
    PROJECT_NAME: str = "Ride Sharing Application"
    PROJECT_VERSION: str = "1.0.0"
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "ride_sharing_app")
    # Comma separated list of allowed origins for CORS
    # Example: http://localhost:5173,http://127.0.0.1:5173,http://YOUR_EC2_IP
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")

@lru_cache()
def get_settings():
    return Settings()

# MongoDB client instance
_client = None
_db = None

async def get_db():
    """Get database instance"""
    global _client, _db
    if _client is None:
        settings = get_settings()
        _client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
        _db = _client[settings.DATABASE_NAME]
        # Test the connection
        try:
            await _client.admin.command('ping')
            print("✅ MongoDB connected successfully")
        except Exception as e:
            print(f"❌ MongoDB connection error: {e}")
            raise e
    return _db
