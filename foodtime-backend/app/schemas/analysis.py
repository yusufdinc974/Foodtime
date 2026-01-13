"""
Analysis Pydantic schemas for AI analysis requests/responses
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DailyAnalysisRequest(BaseModel):
    """Request for daily meal analysis"""
    morning_meal: str
    morning_feeling: Optional[str] = None
    afternoon_meal: str
    afternoon_feeling: Optional[str] = None
    evening_meal: str
    evening_feeling: Optional[str] = None


class FoodQueryRequest(BaseModel):
    """Request for specific food query"""
    food_description: str


class PhotoAnalysisRequest(BaseModel):
    """Request for photo analysis (base64 image)"""
    image_base64: str
    mime_type: str = "image/jpeg"


class AnalysisResponse(BaseModel):
    """Response from AI analysis"""
    analysis_result: str
    health_score: Optional[int] = None
    analysis_type: str
    
    class Config:
        from_attributes = True


class FoodAnalysisResponse(BaseModel):
    """Full food analysis response"""
    id: int
    analysis_type: str
    analysis_result: str
    health_score: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True
