#!/usr/bin/env python3
"""
Main entry point for Infinite Memory API
Standardized startup script for the backend
"""

import sys
import os
import uvicorn
from pathlib import Path

def main():
    """Main function to start the Infinite Memory API server"""
    print("Starting Infinite Memory API Server...")
    print(f"Python version: {sys.version}")
    print(f"Working directory: {os.getcwd()}")
    
    # Check if we're in the backend directory
    if not Path("infinite_memory_api.py").exists():
        print("Error: infinite_memory_api.py not found.")
        print("Please run this script from the backend directory.")
        return 1
    
    try:
        # Import the app
        print("Importing infinite_memory_api...")
        import infinite_memory_api
        print("Import successful")
        
        # Start the server
        print("Starting uvicorn server on http://localhost:8001...")
        uvicorn.run(
            infinite_memory_api.app, 
            host="127.0.0.1", 
            port=8001, 
            log_level="info",
            reload=False
        )
        
    except Exception as e:
        print(f"Error starting server: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
