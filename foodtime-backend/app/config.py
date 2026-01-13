"""
FOOD TIME Backend Application Configuration
"""

from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database
    DATABASE_URL: str
    
    # Google Gemini AI
    GEMINI_API_KEY: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Application
    DEBUG: bool = False
    BACKEND_CORS_ORIGINS: str = '["http://localhost:5173"]'
    
    @property
    def cors_origins(self) -> List[str]:
        """Parse CORS origins from JSON string"""
        return json.loads(self.BACKEND_CORS_ORIGINS)
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
