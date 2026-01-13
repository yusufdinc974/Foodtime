"""
Meal Pydantic schemas for request/response validation
"""

from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class MealBase(BaseModel):
    """Base meal schema"""
    meal_date: date
    morning_meal: Optional[str] = None
    morning_feeling: Optional[str] = None
    afternoon_meal: Optional[str] = None
    afternoon_feeling: Optional[str] = None
    evening_meal: Optional[str] = None
    evening_feeling: Optional[str] = None


class MealCreate(MealBase):
    """Schema for creating a meal entry"""
    user_id: int


class MealResponse(MealBase):
    """Schema for meal response"""
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class MealHistoryResponse(BaseModel):
    """Schema for meal history with summary"""
    day: str
    morning: Optional[str] = None
    afternoon: Optional[str] = None
    evening: Optional[str] = None
    ai_summary: Optional[str] = None
