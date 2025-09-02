#!/usr/bin/env python3
"""
Start Voice Medicine Backend
- Starts the voice medicine API server on port 8002
- Integrates with Gemini API for symptom extraction
- Provides medical diagnosis with proper disclaimers
"""

import sys
import os
import uvicorn
from pathlib import Path

def main():
    """Main function to start the Voice Medicine API server"""
    print("🎤 Starting Voice Medicine API Server...")
    print(f"Python version: {sys.version}")
    print(f"Working directory: {os.getcwd()}")
    
    # Check if we're in the correct directory
    if not Path("backend/voice_medicine_api.py").exists():
        print("Error: backend/voice_medicine_api.py not found.")
        print("Please run this script from the shine2 directory.")
        return 1
    
    try:
        # Import the app
        print("Importing voice_medicine_api...")
        sys.path.append("backend")
        import voice_medicine_api
        print("Import successful")
        
        # Start the server
        print("Starting uvicorn server on http://localhost:8002...")
        print("🎯 Features:")
        print("  - Gemini API integration for symptom extraction")
        print("  - Zabihin/Symptom_to_Diagnosis model integration")
        print("  - AI-powered medical diagnosis")
        print("  - Medical disclaimer integration")
        print("  - Fallback diagnosis system")
        print()
        
        uvicorn.run(
            voice_medicine_api.app, 
            host="127.0.0.1", 
            port=8002, 
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
