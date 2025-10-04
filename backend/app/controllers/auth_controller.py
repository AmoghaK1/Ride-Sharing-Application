from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.models.user_model import UserRegistration
from app.services.user_service import UserService
from app.utils.auth import verify_password, create_access_token
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["authentication"])
user_service = UserService()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register_user(user_data: UserRegistration):
    """Register a new user"""
    try:
        print(f"DEBUG: Received registration data: {user_data.model_dump()}")
        # Check if email already exists
        if await user_service.check_email_exists(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        result = await user_service.create_user(user_data)
        
        if result["success"]:
            return {
                "message": result["message"],
                "user_id": result["user_id"]
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["message"]
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/login")
async def login_user(login_data: LoginRequest):
    """User login endpoint"""
    try:
        # Get user by email
        user = await user_service.get_user_by_email(login_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Verify password
        if not verify_password(login_data.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": str(user["_id"]), "email": user["email"]},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "full_name": user["full_name"],
                "email": user["email"]
            }
        }
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )