# FastAPI entry point
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.controllers import ride_controller
from app.controllers import auth_controller
from app.controllers import routing_controller
from app.controllers import network_controller
from app.config import get_db, get_settings
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.utils.rate_limiter import limiter, rate_limit_middleware

app = FastAPI(title="College Carpool App")

# Configure rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.middleware("http")(rate_limit_middleware)

# Add exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"Validation Error: {exc.errors()}")
    print(f" Body received: {exc.body}")
    
    # Format errors in a user-friendly way
    errors = []
    for error in exc.errors():
        errors.append({
            "field": " -> ".join(str(loc) for loc in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": errors},
    )

# Add CORS middleware (configurable)
settings = get_settings()
origins_raw = settings.ALLOWED_ORIGINS
if origins_raw.strip() == "*":
    allow_origins = ["*"]
    allow_credentials = False  # '*' cannot be used with credentials
else:
    allow_origins = [o.strip() for o in origins_raw.split(',') if o.strip()]
    allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup"""
    try:
        # Initialize database connection
        await get_db()
    except Exception as e:
        print(f" MongoDB connection failed: {e}")

# Register controllers (routers)
app.include_router(ride_controller.router)
app.include_router(auth_controller.router)
app.include_router(routing_controller.router)
app.include_router(network_controller.router)

@app.get("/")
def root():
    return {"message": "Backend is running "}
