#!/bin/bash

# FOOD TIME Backend Startup Script

echo "🚀 Starting FOOD TIME Backend..."
echo ""

cd "$(dirname "$0")"

# Activate virtual environment
echo "📦 Activating virtual environment..."
source venv/bin/activate

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found! Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
fi

# Start the server
echo "🔥 Starting FastAPI server on http://localhost:8000"
echo "📚 API Documentation will be available at http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn app.main:app --reload
