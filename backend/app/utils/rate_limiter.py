from fastapi import HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

async def rate_limit_middleware(request: Request, call_next):
    """Rate limiting middleware."""
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        if "Retry-After" in str(e):
            raise HTTPException(
                status_code=429, 
                detail="Too many requests. Please try again later."
            )
        raise e