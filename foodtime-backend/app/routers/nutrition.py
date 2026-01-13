"""
Nutrition API routes for tracking daily nutrition
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from ..database import get_db
from ..models.user import User
from ..models.meal import Meal
from ..models.food_analysis import FoodAnalysis
from .auth import get_current_user

router = APIRouter(prefix="/api/nutrition", tags=["nutrition"])


@router.get("/daily")
async def get_daily_nutrition(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get today's nutrition totals and compare with user targets
    """
    try:
        today = date.today()
        
        # Get today's meals
        today_meals = db.query(Meal).filter(
            Meal.user_id == current_user.id,
            Meal.meal_date == today
        ).all()
        
        # Get analyses for today's meals
        total_calories = 0.0
        total_protein = 0.0
        total_carbs = 0.0
        total_fat = 0.0
        
        for meal in today_meals:
            analyses = db.query(FoodAnalysis).filter(
                FoodAnalysis.meal_id == meal.id
            ).all()
            
            for analysis in analyses:
                if analysis.calories:
                    total_calories += analysis.calories
                if analysis.protein:
                    total_protein += analysis.protein
                if analysis.carbs:
                    total_carbs += analysis.carbs
                if analysis.fat:
                    total_fat += analysis.fat
        
        # Get user targets
        targets = {
            "calories": current_user.daily_calorie_target or 2000,
            "protein": current_user.daily_protein_target or 150,
            "carbs": current_user.daily_carbs_target or 250,
            "fat": current_user.daily_fat_target or 70
        }
        
        # Calculate percentages
        percentages = {
            "calories": round((total_calories / targets["calories"]) * 100, 1) if targets["calories"] > 0 else 0,
            "protein": round((total_protein / targets["protein"]) * 100, 1) if targets["protein"] > 0 else 0,
            "carbs": round((total_carbs / targets["carbs"]) * 100, 1) if targets["carbs"] > 0 else 0,
            "fat": round((total_fat / targets["fat"]) * 100, 1) if targets["fat"] > 0 else 0
        }
        
        return {
            "consumed": {
                "calories": round(total_calories, 1),
                "protein": round(total_protein, 1),
                "carbs": round(total_carbs, 1),
                "fat": round(total_fat, 1)
            },
            "targets": targets,
            "percentages": percentages
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching nutrition data: {str(e)}")
