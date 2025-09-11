# FastAPI entry point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import ride_controller

app = FastAPI(title="College Carpool App")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register controllers (routers)
app.include_router(ride_controller.router)

@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}
