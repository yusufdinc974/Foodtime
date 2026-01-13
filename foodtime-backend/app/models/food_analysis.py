"""
FoodAnalysis Model - AI analysis results for meals
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base


class FoodAnalysis(Base):
    """AI analysis results table"""
    __tablename__ = "food_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id"), nullable=True)
    
    analysis_type = Column(String(50))  # gunluk, besin, foto
    analysis_result = Column(Text)
    health_score = Column(Float, nullable=True)
    
    # Nutritional data
    calories = Column(Float, nullable=True)
    protein = Column(Float, nullable=True)
    carbs = Column(Float, nullable=True)
    fat = Column(Float, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    meal = relationship("Meal", back_populates="analyses")
    
    def __repr__(self):
        return f"<FoodAnalysis(id={self.id}, type='{self.analysis_type}')>"
