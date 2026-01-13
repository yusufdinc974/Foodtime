"""
Reports API routes for weekly summaries and analytics
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, date
from typing import Optional

from ..database import get_db
from ..models.user import User
from ..models.meal import Meal
from ..models.food_analysis import FoodAnalysis
from ..services.gemini_service import gemini_service
from .auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["reports"])


def get_week_range(week_offset: int = 0):
    """Get start and end dates for a week (Monday to Sunday)"""
    today = date.today()
    # Get Monday of current week
    monday = today - timedelta(days=today.weekday())
    # Apply offset
    start = monday + timedelta(weeks=week_offset)
    end = start + timedelta(days=6)
    return start, end


@router.get("/weekly")
async def get_weekly_report(
    week_offset: int = Query(0, description="Week offset: 0=current, -1=last week, etc."),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate weekly summary report with AI insights
    """
    try:
        week_start, week_end = get_week_range(week_offset)
        
        # Get all meals for the week
        weekly_meals = db.query(Meal).filter(
            Meal.user_id == current_user.id,
            Meal.meal_date >= week_start,
            Meal.meal_date <= week_end
        ).order_by(Meal.meal_date).all()
        
        # Aggregate statistics
        total_meals = len(weekly_meals)
        total_calories = 0.0
        total_protein = 0.0
        total_carbs = 0.0
        total_fat = 0.0
        health_scores = []
        
        daily_breakdown = []
        best_day = {"date": None, "score": 0}
        worst_day = {"date": None, "score": 10}
        
        # Process each day
        for i in range(7):
            day_date = week_start + timedelta(days=i)
            day_meals = [m for m in weekly_meals if m.meal_date == day_date]
            
            day_calories = 0.0
            day_scores = []
            
            for meal in day_meals:
                analyses = db.query(FoodAnalysis).filter(
                    FoodAnalysis.meal_id == meal.id
                ).all()
                
                for analysis in analyses:
                    if analysis.health_score:
                        day_scores.append(analysis.health_score)
                        health_scores.append(analysis.health_score)
                    if analysis.calories:
                        day_calories += analysis.calories
                        total_calories += analysis.calories
                    if analysis.protein:
                        total_protein += analysis.protein
                    if analysis.carbs:
                        total_carbs += analysis.carbs
                    if analysis.fat:
                        total_fat += analysis.fat
            
            day_avg_score = sum(day_scores) / len(day_scores) if day_scores else 0
            
            daily_breakdown.append({
                "date": day_date.isoformat(),
                "health_score": round(day_avg_score, 1),
                "calories": round(day_calories, 1),
                "meal_count": len(day_meals)
            })
            
            # Track best/worst days
            if day_avg_score > 0:
                if day_avg_score > best_day["score"]:
                    best_day = {"date": day_date.isoformat(), "score": day_avg_score}
                if day_avg_score < worst_day["score"]:
                    worst_day = {"date": day_date.isoformat(), "score": day_avg_score}
        
        # Calculate averages
        avg_health_score = sum(health_scores) / len(health_scores) if health_scores else 0
        avg_calories_per_day = total_calories / 7 if total_calories > 0 else 0
        
        # Calculate trends (compare to previous week if available)
        prev_week_start, prev_week_end = get_week_range(week_offset - 1)
        prev_meals = db.query(Meal).filter(
            Meal.user_id == current_user.id,
            Meal.meal_date >= prev_week_start,
            Meal.meal_date <= prev_week_end
        ).all()
        
        prev_scores = []
        prev_calories = 0.0
        for meal in prev_meals:
            analyses = db.query(FoodAnalysis).filter(
                FoodAnalysis.meal_id == meal.id
            ).all()
            for analysis in analyses:
                if analysis.health_score:
                    prev_scores.append(analysis.health_score)
                if analysis.calories:
                    prev_calories += analysis.calories
        
        prev_avg_score = sum(prev_scores) / len(prev_scores) if prev_scores else avg_health_score
        prev_avg_calories = prev_calories / 7 if prev_calories > 0 else avg_calories_per_day
        
        # Determine trends
        score_diff = avg_health_score - prev_avg_score
        cal_diff = avg_calories_per_day - prev_avg_calories
        
        health_score_trend = "stable"
        if score_diff > 0.5:
            health_score_trend = "improving"
        elif score_diff < -0.5:
            health_score_trend = "declining"
        
        calorie_trend = "stable"
        if cal_diff > 200:
            calorie_trend = "increasing"
        elif cal_diff < -200:
            calorie_trend = "decreasing"
        
        # Generate AI insights
        insights = ""
        if total_meals > 0:
            # Prepare meal data for AI
            meal_summary = []
            for meal in weekly_meals:
                meal_summary.append({
                    "date": meal.meal_date.isoformat(),
                    "morning": meal.morning_meal or "",
                    "afternoon": meal.afternoon_meal or "",
                    "evening": meal.evening_meal or ""
                })
            
            weekly_stats = {
                "avg_health_score": round(avg_health_score, 1),
                "total_calories": round(total_calories, 1),
                "avg_calories": round(avg_calories_per_day, 1),
                "total_protein": round(total_protein, 1),
                "total_carbs": round(total_carbs, 1),
                "total_fat": round(total_fat, 1),
                "total_meals": total_meals
            }
            
            user_goals = {
                "daily_calorie_target": current_user.daily_calorie_target,
                "goal": current_user.goal
            }
            
            insights = await gemini_service.generate_weekly_insights(
                meal_summary,
                weekly_stats,
                user_goals
            )
        else:
            insights = "Bu hafta için yeterli veri yok. Öğünlerinizi kaydetmeye başlayın!"
        
        return {
            "week_start": week_start.isoformat(),
            "week_end": week_end.isoformat(),
            "summary": {
                "total_meals": total_meals,
                "avg_health_score": round(avg_health_score, 1),
                "total_calories": round(total_calories, 1),
                "avg_calories_per_day": round(avg_calories_per_day, 1),
                "macros": {
                    "protein": round(total_protein, 1),
                    "carbs": round(total_carbs, 1),
                    "fat": round(total_fat, 1)
                }
            },
            "daily_breakdown": daily_breakdown,
            "insights": insights,
            "trends": {
                "health_score_trend": health_score_trend,
                "calorie_trend": calorie_trend,
                "best_day": best_day["date"] if best_day["date"] else None,
                "worst_day": worst_day["date"] if worst_day["date"] else None
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating weekly report: {str(e)}")
