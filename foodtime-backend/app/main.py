"""
FOOD TIME Backend - FastAPI Application
Main application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import create_tables
from .routers import users_router, meals_router, analysis_router, auth_router, dashboard_router, nutrition_router, reports_router

# Create FastAPI application
app = FastAPI(
    title="FOOD TIME API",
    description="Nutrition tracking and analysis API powered by Google Gemini AI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)  # Auth router first (no auth required)
app.include_router(dashboard_router)
app.include_router(nutrition_router)
app.include_router(reports_router)
app.include_router(users_router)
app.include_router(meals_router)
app.include_router(analysis_router)


@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    create_tables()
    print("✅ Database tables created successfully")
    print(f"✅ FOOD TIME Backend is running on port 8000")
    print(f"📚 API Documentation: http://localhost:8000/docs")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "FOOD TIME API - Nutrition Tracking & Analysis",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "FOOD TIME Backend"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
