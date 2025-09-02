#!/usr/bin/env python3
"""
Start Complete System: Frontend + Infinite Memory Backend
"""

import subprocess
import sys
import os
import time
import threading
from pathlib import Path

def start_infinite_memory_backend():
    """Start the infinite memory backend"""
    print("🧠 Starting Infinite Memory Backend...")
    backend_dir = Path(__file__).parent / "backend"
    os.chdir(backend_dir)
    
    try:
        subprocess.run([sys.executable, "infinite_memory_api.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Infinite Memory Backend stopped")
    except Exception as e:
        print(f"❌ Backend error: {e}")

def start_frontend():
    """Start the frontend development server"""
    print("🎨 Starting Frontend...")
    project_dir = Path(__file__).parent
    os.chdir(project_dir)
    
    try:
        subprocess.run(["npm", "run", "dev"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Frontend stopped")
    except Exception as e:
        print(f"❌ Frontend error: {e}")

def main():
    """Start both frontend and backend"""
    print("🚀 Starting Complete MedChain System with Infinite Memory")
    print("=" * 60)
    print("📊 Backend: Infinite Memory API (http://localhost:8001)")
    print("🎨 Frontend: React App (http://localhost:8976)")
    print("💾 Database: SQLite (infinite_memory.db)")
    print("=" * 60)
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=start_infinite_memory_backend, daemon=True)
    backend_thread.start()
    
    # Wait a moment for backend to start
    print("⏳ Waiting for backend to initialize...")
    time.sleep(3)
    
    # Start frontend
    try:
        start_frontend()
    except KeyboardInterrupt:
        print("\n🛑 System stopped by user")
    except Exception as e:
        print(f"❌ System error: {e}")

if __name__ == "__main__":
    main()
