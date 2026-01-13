"""
Meal API routes (Protected - requires authentication)
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from ..database import get_db
from ..schemas.meal import MealCreate, MealResponse
from ..services.meal_service import MealService
from ..models.user import User
from ..models.meal import Meal
from .auth import get_current_user

router = APIRouter(prefix="/api/meals", tags=["meals"])


@router.post("/", response_model=MealResponse, status_code=status.HTTP_201_CREATED)
def create_meal(
    meal_data: MealCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new meal entry for current user"""
    # Override user_id with current user
    meal_data.user_id = current_user.id
    
    # Check if meal already exists for this date
    existing_meal = MealService.get_meal_by_date(db, current_user.id, meal_data.meal_date)
    if existing_meal:
        # Update existing meal instead of creating new one
        update_data = meal_data.model_dump(exclude={"user_id"})
        return MealService.update_meal(db, existing_meal.id, update_data)
    
    return MealService.create_meal(db, meal_data)


@router.get("/history", response_model=List[MealResponse])
def get_my_meal_history(
    days: int = Query(10, ge=1, le=30, description="Number of days to retrieve"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get meal history for current user"""
    meals = MealService.get_meal_history(db, current_user.id, days)
    return meals


@router.get("/{meal_id}", response_model=MealResponse)
def get_meal(
    meal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific meal by ID (only if it belongs to current user)"""
    meal = db.query(Meal).filter(
        Meal.id == meal_id,
        Meal.user_id == current_user.id
    ).first()
    
    if not meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal not found"
        )
    return meal


@router.delete("/{meal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal(
    meal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a meal entry (only if it belongs to current user)"""
    meal = db.query(Meal).filter(
        Meal.id == meal_id,
        Meal.user_id == current_user.id
    ).first()
    
    if not meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal not found"
        )
    
    success = MealService.delete_meal(db, meal_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal not found"
        )
