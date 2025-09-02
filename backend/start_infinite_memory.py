#!/usr/bin/env python3
"""
Reliable startup script for Infinite Memory API
"""

import os
import sys
import subprocess
import time
import requests
from pathlib import Path

def check_port_available(port):
    """Check if a port is available"""
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) != 0

def start_server():
    """Start the infinite memory server"""
    print("🚀 Starting Infinite Memory API Server...")
    
    # Check if we're in the right directory
    if not Path("infinite_memory_api.py").exists():
        print("❌ infinite_memory_api.py not found. Please run this script from the backend directory.")
        return False
    
    # Check if port 8001 is available
    if not check_port_available(8001):
        print("⚠️  Port 8001 is already in use. Trying to kill existing processes...")
        try:
            # Kill any Python processes that might be using the port
            subprocess.run(["taskkill", "/F", "/IM", "python.exe"], 
                         capture_output=True, text=True)
            time.sleep(2)
        except:
            pass
    
    # Start the server
    try:
        print("🌐 Starting server on http://localhost:8001...")
        process = subprocess.Popen([
            sys.executable, "main.py"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        # Wait a bit for the server to start
        time.sleep(5)
        
        # Test if the server is running
        try:
            response = requests.get("http://localhost:8001/", timeout=5)
            if response.status_code == 200:
                print("✅ Server started successfully!")
                print("🔗 API Documentation: http://localhost:8001/docs")
                print("🔗 Health Check: http://localhost:8001/")
                print("\n📋 Available endpoints:")
                print("  - POST /process-text")
                print("  - POST /query")
                print("  - POST /query-gemini (Gemini AI)")
                print("  - GET /conversation-history/{user_id}")
                print("  - POST /tasks/create")
                print("  - GET /tasks/{patient_id}")
                print("\n🛑 Press Ctrl+C to stop the server")
                
                # Keep the process running
                try:
                    process.wait()
                except KeyboardInterrupt:
                    print("\n🛑 Stopping server...")
                    process.terminate()
                    process.wait()
                    print("✅ Server stopped.")
                
                return True
            else:
                print(f"❌ Server responded with status {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ Server not responding: {e}")
            print("📋 Server output:")
            stdout, stderr = process.communicate()
            if stdout:
                print("STDOUT:", stdout)
            if stderr:
                print("STDERR:", stderr)
            return False
            
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        return False

if __name__ == "__main__":
    success = start_server()
    sys.exit(0 if success else 1)
