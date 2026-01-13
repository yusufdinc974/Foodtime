#!/bin/bash

# FOOD TIME Frontend Startup Script

echo "🚀 Starting FOOD TIME Frontend..."
echo ""

cd "$(dirname "$0")"

# Start Vite dev server
echo "⚡ Starting Vite dev server on http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
