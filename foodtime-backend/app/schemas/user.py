"""
User Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema with common fields"""
    name: str = Field(..., min_length=1, max_length=100)
    weight: Optional[float] = Field(None, gt=0, description="Weight in kg")
    height: Optional[float] = Field(None, gt=0, description="Height in cm")
    gender: Optional[str] = Field(None, max_length=20)
    job: Optional[str] = Field(None, max_length=100)
    goal: Optional[str] = Field(None, max_length=50)


class UserCreate(UserBase):
    """Schema for creating a new user"""
    pass


class UserUpdate(BaseModel):
    """Schema for updating user (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    weight: Optional[float] = Field(None, gt=0)
    height: Optional[float] = None
    gender: Optional[str] = None
    job: Optional[str] = None
    goal: Optional[str] = None
    daily_calorie_target: Optional[int] = None
    daily_protein_target: Optional[int] = None
    daily_carbs_target: Optional[int] = None
    daily_fat_target: Optional[int] = None


class UserResponse(UserBase):
    """Schema for user response"""
    daily_calorie_target: Optional[int] = None
    daily_protein_target: Optional[int] = None
    daily_carbs_target: Optional[int] = None
    daily_fat_target: Optional[int] = None
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
