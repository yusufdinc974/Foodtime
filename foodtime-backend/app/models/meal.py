"""
Meal database model
"""

from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base


class Meal(Base):
    """Daily meal entries table"""
    __tablename__ = "meals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    meal_date = Column(Date, nullable=False, index=True)
    
    # Morning meal
    morning_meal = Column(Text, nullable=True)
    morning_feeling = Column(String(100), nullable=True)
    
    # Afternoon meal
    afternoon_meal = Column(Text, nullable=True)
    afternoon_feeling = Column(String(100), nullable=True)
    
    # Evening meal
    evening_meal = Column(Text, nullable=True)
    evening_feeling = Column(String(100), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="meals")
    analyses = relationship("FoodAnalysis", back_populates="meal", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Meal(id={self.id}, user_id={self.user_id}, date={self.meal_date})>"
