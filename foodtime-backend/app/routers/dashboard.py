"""
Dashboard router for aggregated user statistics
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta, date
from typing import List, Optional

from ..database import get_db
from ..models.user import User
from ..models.meal import Meal
from ..models.food_analysis import FoodAnalysis
from .auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get aggregated statistics for dashboard display
    """
    try:
        today = date.today()
        week_ago = today - timedelta(days=6)  # Last 7 days including today
        
        # Get all user's meals
        all_meals = db.query(Meal).filter(
            Meal.user_id == current_user.id
        ).order_by(desc(Meal.meal_date)).all()
        
        # Today's stats
        today_meals = [m for m in all_meals if m.meal_date == today]
        today_analyses = []
        today_health_score = 0.0
        
        if today_meals:
            for meal in today_meals:
                analyses = db.query(FoodAnalysis).filter(
                    FoodAnalysis.meal_id == meal.id
                ).all()
                today_analyses.extend(analyses)
            
            if today_analyses:
                scores = [a.health_score for a in today_analyses if a.health_score]
                today_health_score = sum(scores) / len(scores) if scores else 0.0
        
        # Week trend (last 7 days)
        week_trend = []
        for i in range(6, -1, -1):  # 6 days ago to today
            day = today - timedelta(days=i)
            day_meals = [m for m in all_meals if m.meal_date == day]
            
            if day_meals:
                day_analyses = []
                for meal in day_meals:
                    analyses = db.query(FoodAnalysis).filter(
                        FoodAnalysis.meal_id == meal.id
                    ).all()
                    day_analyses.extend(analyses)
                
                if day_analyses:
                    scores = [a.health_score for a in day_analyses if a.health_score]
                    avg_score = sum(scores) / len(scores) if scores else 0.0
                else:
                    avg_score = 0.0
            else:
                avg_score = 0.0
            
            week_trend.append({
                "date": day.isoformat(),
                "score": round(avg_score, 1)
            })
        
        # Recent meals (last 5)
        recent_meals = []
        for meal in all_meals[:5]:
            # Get the meal's analysis
            analysis = db.query(FoodAnalysis).filter(
                FoodAnalysis.meal_id == meal.id
            ).first()
            
            # Determine meal type and description
            meal_parts = []
            if meal.morning_meal:
                meal_parts.append(f"Sabah: {meal.morning_meal[:50]}")
            if meal.afternoon_meal:
                meal_parts.append(f"Öğle: {meal.afternoon_meal[:50]}")
            if meal.evening_meal:
                meal_parts.append(f"Akşam: {meal.evening_meal[:50]}")
            
            recent_meals.append({
                "id": meal.id,
                "date": meal.meal_date.isoformat(),
                "description": " | ".join(meal_parts) if meal_parts else "Öğün detayı yok",
                "health_score": analysis.health_score if analysis else 0.0
            })
        
        # Calculate streak (consecutive days with meals)
        streak_days = 0
        check_date = today
        while True:
            day_has_meal = any(m.meal_date == check_date for m in all_meals)
            if day_has_meal:
                streak_days += 1
                check_date = check_date - timedelta(days=1)
            else:
                break
        
        # Overall summary
        if all_meals:
            all_analyses = db.query(FoodAnalysis).join(Meal).filter(
                Meal.user_id == current_user.id
            ).all()
            
            all_scores = [a.health_score for a in all_analyses if a.health_score]
            avg_score = sum(all_scores) / len(all_scores) if all_scores else 0.0
        else:
            avg_score = 0.0
        
        # Calculate week average
        week_scores = [day["score"] for day in week_trend if day["score"] > 0]
        week_avg = sum(week_scores) / len(week_scores) if week_scores else 0.0
        
        return {
            "today": {
                "health_score": round(today_health_score, 1),
                "meals_logged": len(today_meals),
                "date": today.isoformat()
            },
            "week_trend": week_trend,
            "recent_meals": recent_meals,
            "summary": {
                "total_meals": len(all_meals),
                "avg_score": round(avg_score, 1),
                "week_avg": round(week_avg, 1),
                "streak_days": streak_days
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard stats: {str(e)}")
