# FastAPI entry point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import ride_controller
from app.controllers import auth_controller
from app.config import mongodb_client

app = FastAPI(title="College Carpool App")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Test MongoDB connection on startup"""
    try:
        # Ping the database to verify connection
        mongodb_client.admin.command('ping')
        print("✅ MongoDB connected successfully")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")

# Register controllers (routers)
app.include_router(ride_controller.router)
app.include_router(auth_controller.router)

@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}
