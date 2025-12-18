"""
Main entry point for the TOAI backend.
This script runs the FastAPI application from the ai_engine package.

Usage: python run.py
"""
import os
import sys

# Get the absolute path of the backend directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
ai_engine_dir = os.path.join(backend_dir, "ai_engine")

# Add both directories to Python path
sys.path.insert(0, backend_dir)
sys.path.insert(0, ai_engine_dir)

# Change working directory to ai_engine so all relative paths work
os.chdir(ai_engine_dir)

# Load environment variables from ai_engine/.env
from dotenv import load_dotenv
load_dotenv(os.path.join(ai_engine_dir, ".env"))

if __name__ == "__main__":
    import uvicorn
    
    print(f"[TOAI] Backend directory: {backend_dir}")
    print(f"[TOAI] AI Engine directory: {ai_engine_dir}")
    print(f"[TOAI] Working directory: {os.getcwd()}")
    print(f"[TOAI] Starting server on http://localhost:5000")
    
    # Run the app directly from app.py in ai_engine
    # Since we changed cwd to ai_engine, we can just import "app"
    # Using port 5001 to avoid conflict with Express server on 5000
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True, reload_dirs=[ai_engine_dir])
