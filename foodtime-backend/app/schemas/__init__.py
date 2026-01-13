"""
Schemas package initialization
"""

from .user import UserCreate, UserUpdate, UserResponse
from .meal import MealCreate, MealResponse, MealHistoryResponse
from .analysis import (
    DailyAnalysisRequest,
    FoodQueryRequest,
    PhotoAnalysisRequest,
    AnalysisResponse,
    FoodAnalysisResponse
)

__all__ = [
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "MealCreate",
    "MealResponse",
    "MealHistoryResponse",
    "DailyAnalysisRequest",
    "FoodQueryRequest",
    "PhotoAnalysisRequest",
    "AnalysisResponse",
    "FoodAnalysisResponse"
]
