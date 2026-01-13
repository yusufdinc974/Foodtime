"""
Analysis API routes for AI-powered food analysis
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.analysis import (
    DailyAnalysisRequest,
    FoodQueryRequest,
    PhotoAnalysisRequest,
    AnalysisResponse
)
from ..services.gemini_service import gemini_service
from ..services.meal_service import MealService
from ..models.food_analysis import FoodAnalysis
from ..models.user import User
from .auth import get_current_user
from datetime import date

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


@router.post("/daily", response_model=AnalysisResponse)
async def analyze_daily_meals(
    request: DailyAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze daily meals and provide recommendations for current user
    """
    try:
        # Get meal history for context
        meal_history = MealService.get_meal_history(db, current_user.id, days=10)
        
        # Format history for AI
        history_data = [
            {
                "date": str(meal.meal_date),
                "morning": meal.morning_meal,
                "afternoon": meal.afternoon_meal,
                "evening": meal.evening_meal
            }
            for meal in meal_history
        ]
        
        # Call Gemini AI
        result = await gemini_service.analyze_daily_meals(
            morning=request.morning_meal,
            afternoon=request.afternoon_meal,
            evening=request.evening_meal,
            meal_history=history_data
        )
        
        analysis_text = result["analysis"]
        health_score = result.get("health_score")
        calories = result.get("calories")
        protein = result.get("protein")
        carbs = result.get("carbs")
        fat = result.get("fat")
        
        # Save analysis to database
        # First, create or get today's meal
        from ..schemas.meal import MealCreate
        meal_data = MealCreate(
            user_id=current_user.id,
            meal_date=date.today(),
            morning_meal=request.morning_meal,
            morning_feeling=request.morning_feeling,
            afternoon_meal=request.afternoon_meal,
            afternoon_feeling=request.afternoon_feeling,
            evening_meal=request.evening_meal,
            evening_feeling=request.evening_feeling
        )
        
        existing_meal = MealService.get_meal_by_date(db, current_user.id, date.today())
        if existing_meal:
            meal = MealService.update_meal(db, existing_meal.id, meal_data.model_dump(exclude={"user_id"}))
        else:
            meal = MealService.create_meal(db, meal_data)
        
        # Save analysis with health score and nutrition
        analysis = FoodAnalysis(
            meal_id=meal.id,
            analysis_type="gunluk",
            analysis_result=analysis_text,
            health_score=health_score,
            calories=calories,
            protein=protein,
            carbs=carbs,
            fat=fat
        )
        db.add(analysis)
        db.commit()
        
        return AnalysisResponse(
            analysis_result=analysis_text,
            health_score=health_score,
            analysis_type="gunluk"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )


@router.post("/food", response_model=AnalysisResponse)
async def analyze_food(request: FoodQueryRequest):
    """
    Analyze specific food or ingredient
    """
    try:
        result = await gemini_service.analyze_food(request.food_description)
        
        return AnalysisResponse(
            analysis_result=result["analysis"],
            health_score=result["health_score"],
            analysis_type="besin"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Food analysis failed: {str(e)}"
        )


@router.post("/photo", response_model=AnalysisResponse)
async def analyze_photo(request: PhotoAnalysisRequest):
    """
    Analyze food from uploaded photo
    """
    try:
        result = await gemini_service.analyze_photo(
            request.image_base64,
            request.mime_type
        )
        
        return AnalysisResponse(
            analysis_result=result["analysis"],
            health_score=result["health_score"],
            analysis_type="foto"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Photo analysis failed: {str(e)}"
        )
