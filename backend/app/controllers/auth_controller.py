from fastapi import APIRouter, HTTPException, status
from app.models.user_model import UserRegistration
from app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["authentication"])
user_service = UserService()

@router.post("/register")
async def register_user(user_data: UserRegistration):
    """Register a new user"""
    try:
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