from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime

class HomeAddress(BaseModel):
    society_hostel_name: str
    street: str
    area: str
    pin_code: str

class UserRegistration(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    residence_type: str
    has_vehicle: str
    vehicle_type: Optional[str] = None
    home_address: HomeAddress
    college_address: str
    agree_to_terms: bool

    @validator('full_name')
    def validate_full_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Full name must be at least 2 characters long')
        return v.strip()

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v

    @validator('vehicle_type')
    def validate_vehicle_type(cls, v, values):
        if values.get('has_vehicle') == 'yes' and not v:
            raise ValueError('Vehicle type is required when user has a vehicle')
        return v

    @validator('agree_to_terms')
    def validate_terms(cls, v):
        if not v:
            raise ValueError('You must agree to the terms and conditions')
        return v

class User(BaseModel):
    full_name: str
    email: str
    password_hash: str
    residence_type: str
    has_vehicle: str
    vehicle_type: Optional[str] = None
    home_address: HomeAddress
    college_address: str
    created_at: datetime
    is_active: bool = True