#!/usr/bin/env python3
"""
Enhanced Drone Delivery Backend Startup Script
==============================================

This script starts the enhanced drone delivery API with all advanced features:
- AI-powered flight planning
- Weather integration
- Safety features
- Customer experience enhancements
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'pydantic',
        'asyncio'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing required packages: {', '.join(missing_packages)}")
        print("Please install them using: pip install fastapi uvicorn pydantic")
        return False
    
    return True

def start_enhanced_drone_api():
    """Start the enhanced drone delivery API"""
    print("🚁 Starting Enhanced Drone Delivery API...")
    print("=" * 50)
    
    # Change to the backend directory
    backend_dir = Path(__file__).parent / "backend"
    if not backend_dir.exists():
        print(f"❌ Backend directory not found: {backend_dir}")
        return False
    
    os.chdir(backend_dir)
    
    # Start the FastAPI server
    try:
        print("📍 Starting server on http://localhost:8000")
        print("📚 API Documentation: http://localhost:8000/docs")
        print("🔧 Interactive API docs: http://localhost:8000/redoc")
        print("=" * 50)
        
        # Start uvicorn server
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "enhanced_drone_api:app",
            "--host", "0.0.0.0",
            "--port", "8000",
            "--reload"
        ])
        
    except KeyboardInterrupt:
        print("\n🛑 Enhanced Drone API stopped by user")
    except Exception as e:
        print(f"❌ Error starting Enhanced Drone API: {e}")
        return False
    
    return True

def main():
    """Main function"""
    print("🚁 Enhanced Drone Delivery System")
    print("Advanced AI-powered medical supply delivery")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Start the API
    if not start_enhanced_drone_api():
        sys.exit(1)

if __name__ == "__main__":
    main()


