#!/usr/bin/env python3
"""
Simple startup script for the Infinite Memory API
"""

import sys
import os
import traceback

def start_server():
    try:
        print("🚀 Starting Infinite Memory API Server...")
        print(f"Python version: {sys.version}")
        print(f"Working directory: {os.getcwd()}")
        
        # Import the app
        print("📦 Importing infinite_memory_api...")
        import infinite_memory_api
        print("✅ Import successful")
        
        # Start the server using main.py
        print("🌐 Starting server using main.py...")
        import subprocess
        subprocess.run([sys.executable, "main.py"])
        
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("📋 Full traceback:")
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    exit_code = start_server()
    sys.exit(exit_code)
