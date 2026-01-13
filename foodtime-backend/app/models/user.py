"""
User database model
"""

from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base


class User(Base):
    """User profile table"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Integer, default=1)  # SQLite uses INTEGER for boolean
    
    weight = Column(Float, nullable=True)  # in kg
    height = Column(Float, nullable=True)  # in cm
    gender = Column(String(20), nullable=True)  # Erkek/Kadın
    job = Column(String(100), nullable=True)
    goal = Column(String(50), nullable=True)  # Kilo Ver/Kas Yap/Denge
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Daily nutrition targets
    daily_calorie_target = Column(Integer, default=2000)
    daily_protein_target = Column(Integer, default=150)
    daily_carbs_target = Column(Integer, default=250)
    daily_fat_target = Column(Integer, default=70)
    
    # Relationships
    meals = relationship("Meal", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', name='{self.name}')>"
