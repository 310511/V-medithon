#!/usr/bin/env python3
"""
Startup script for Meal-Based Insulin Prediction API
"""

import subprocess
import sys
import os
import time
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'pydantic',
        'numpy',
        'scikit-learn',
        'joblib'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing required packages: {', '.join(missing_packages)}")
        print("Installing missing packages...")
        for package in missing_packages:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
        print("✅ All packages installed successfully!")
    else:
        print("✅ All required packages are available")

def create_directories():
    """Create necessary directories"""
    directories = ['models', 'logs']
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
    print("✅ Directories created")

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting Meal-Based Insulin Prediction API...")
    print("📍 Server will be available at: http://localhost:8001")
    print("📚 API Documentation: http://localhost:8001/docs")
    print("🛑 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        # Change to the backend directory
        backend_dir = Path(__file__).parent / 'backend'
        os.chdir(backend_dir)
        
        # Start the server
        subprocess.run([
            sys.executable, '-m', 'uvicorn', 
            'meal_insulin_prediction_api:app',
            '--host', '0.0.0.0',
            '--port', '8001',
            '--reload'
        ])
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def main():
    """Main function"""
    print("🍽️ Meal-Based Insulin Prediction System")
    print("=" * 50)
    
    # Check dependencies
    check_dependencies()
    
    # Create directories
    create_directories()
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()
