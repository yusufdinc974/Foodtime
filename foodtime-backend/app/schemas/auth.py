"""
Authentication Pydantic schemas
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class SignupRequest(BaseModel):
    """Schema for user signup"""
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    name: str = Field(..., min_length=1, max_length=100)
    weight: Optional[float] = None
    height: Optional[float] = None
    gender: Optional[str] = None
    job: Optional[str] = None
    goal: Optional[str] = None


class LoginRequest(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema for token response"""
    access_token: str
    token_type: str = "bearer"


class UserInToken(BaseModel):
    """Schema for user data in JWT payload"""
    user_id: int
    email: str
