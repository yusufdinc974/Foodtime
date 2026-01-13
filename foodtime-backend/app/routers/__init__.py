"""
Routers package initialization
"""

from .users import router as users_router
from .meals import router as meals_router
from .analysis import router as analysis_router
from .auth import router as auth_router
from .dashboard import router as dashboard_router
from .nutrition import router as nutrition_router
from .reports import router as reports_router

__all__ = ["users_router", "meals_router", "analysis_router", "auth_router", "dashboard_router", "nutrition_router", "reports_router"]
