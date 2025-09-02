#!/usr/bin/env python3
"""
Start Infinite Memory Backend with Permanent Storage
"""

import subprocess
import sys
import os
from pathlib import Path

def main():
    """Start the infinite memory backend"""
    print("🧠 Starting Infinite Memory Backend with Permanent Storage...")
    
    # Change to the backend directory
    backend_dir = Path(__file__).parent / "backend"
    os.chdir(backend_dir)
    
    try:
        # Start the infinite memory API
        print("🚀 Starting Infinite Memory API on http://localhost:8001")
        print("📊 Database: SQLite (infinite_memory.db)")
        print("🔗 API Documentation: http://localhost:8001/docs")
        print("💾 Features: Persistent storage, task management, analytics")
        print("\n" + "="*60)
        
        subprocess.run([
            sys.executable, "infinite_memory_api.py"
        ], check=True)
        
    except KeyboardInterrupt:
        print("\n🛑 Infinite Memory Backend stopped by user")
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

