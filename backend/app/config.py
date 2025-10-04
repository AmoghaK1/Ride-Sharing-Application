# Database connection and settings configuration
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB configuration
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "ride_sharing_app")

# MongoDB client instance
mongodb_client = MongoClient(MONGODB_URL)
database = mongodb_client[DATABASE_NAME]

def get_database():
    """Get database instance"""
    return database
