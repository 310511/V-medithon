#!/usr/bin/env python3
"""
Test environment variables
"""

import os
import sys
sys.path.append('backend')

def test_env_vars():
    print("🔍 Testing environment variables...")
    
    # Check if .env file exists
    env_file = ".env"
    if os.path.exists(env_file):
        print(f"✅ .env file exists")
        with open(env_file, 'r') as f:
            content = f.read()
            if "GEMINI_API_KEY" in content:
                print("✅ GEMINI_API_KEY found in .env file")
                # Extract the key (without showing the full key)
                lines = content.split('\n')
                for line in lines:
                    if line.startswith('GEMINI_API_KEY=AIzaSyByWvWkLKedG2WKnxtVhefQBRLZyrwf-tE'):                      key = line.split('=', 1)[1]
                        print(f"   Key length: {len(key)} characters")
                        print(f"   Key starts with: {key[:10]}...")
                        break
            else:
                print("❌ GEMINI_API_KEY not found in .env file")
    else:
        print("❌ .env file not found")
    
    # Check environment variable
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        print(f"✅ GEMINI_API_KEY environment variable is set")
        print(f"   Key length: {len(gemini_key)} characters")
        print(f"   Key starts with: {gemini_key[:10]}...")
    else:
        print("❌ GEMINI_API_KEY environment variable not set")
    
    # Test loading from backend
    print("\n🔍 Testing backend environment loading...")
    try:
        from infinite_memory_api import GEMINI_API_KEY, gemini_model
        if GEMINI_API_KEY:
            print(f"✅ Backend loaded GEMINI_API_KEY")
            print(f"   Key length: {len(GEMINI_API_KEY)} characters")
            print(f"   Key starts with: {GEMINI_API_KEY[:10]}...")
        else:
            print("❌ Backend GEMINI_API_KEY is None")
            
        if gemini_model:
            print("✅ Gemini model is initialized")
        else:
            print("❌ Gemini model is None")
            
    except Exception as e:
        print(f"❌ Error importing from backend: {e}")

if __name__ == "__main__":
    test_env_vars()
