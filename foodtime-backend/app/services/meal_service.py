"""
Meal service for business logic
"""

from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..models.meal import Meal
from ..schemas.meal import MealCreate
from typing import List, Optional
from datetime import date, timedelta


class MealService:
    """Meal business logic"""
    
    @staticmethod
    def create_meal(db: Session, meal_data: MealCreate) -> Meal:
        """Create a new meal entry"""
        meal = Meal(**meal_data.model_dump())
        db.add(meal)
        db.commit()
        db.refresh(meal)
        return meal
    
    @staticmethod
    def get_meal_by_date(db: Session, user_id: int, meal_date: date) -> Optional[Meal]:
        """Get meal by user and date"""
        return db.query(Meal).filter(
            Meal.user_id == user_id,
            Meal.meal_date == meal_date
        ).first()
    
    @staticmethod
    def get_meal_history(db: Session, user_id: int, days: int = 10) -> List[Meal]:
        """Get meal history for the past N days"""
        start_date = date.today() - timedelta(days=days)
        return db.query(Meal).filter(
            Meal.user_id == user_id,
            Meal.meal_date >= start_date
        ).order_by(desc(Meal.meal_date)).limit(days).all()
    
    @staticmethod
    def update_meal(db: Session, meal_id: int, meal_data: dict) -> Optional[Meal]:
        """Update an existing meal"""
        meal = db.query(Meal).filter(Meal.id == meal_id).first()
        if not meal:
            return None
        
        for field, value in meal_data.items():
            if hasattr(meal, field):
                setattr(meal, field, value)
        
        db.commit()
        db.refresh(meal)
        return meal
    
    @staticmethod
    def delete_meal(db: Session, meal_id: int) -> bool:
        """Delete a meal entry"""
        meal = db.query(Meal).filter(Meal.id == meal_id).first()
        if not meal:
            return False
        
        db.delete(meal)
        db.commit()
        return True
