#!/usr/bin/env python3
"""
Test Gemini API locally with the correct API key
"""

import os
import sys
import google.generativeai as genai

def test_gemini_api():
    """Test Gemini API with the correct key"""
    print("🧪 Testing Gemini API locally...")
    
    # Set the API key
    api_key = "AIzaSyByWvWkLKedG2WKnxtVhefQBRLZyrwf-tE"
    os.environ["GEMINI_API_KEY"] = api_key
    
    try:
        # Configure Gemini
        genai.configure(api_key=api_key)
        print("✅ Gemini configured successfully")
        
        # Create model
        model = genai.GenerativeModel('gemini-1.5-flash')
        print("✅ Model created successfully")
        
        # Test prompt
        prompt = "Hello, this is a test of the Gemini API. Please respond with a simple greeting."
        
        # Generate response
        print("🔄 Generating response...")
        response = model.generate_content(prompt)
        
        print(f"✅ Gemini API Response: {response.text}")
        return True
        
    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_infinite_memory_import():
    """Test importing infinite memory API"""
    print("\n🧪 Testing Infinite Memory API import...")
    
    try:
        # Set environment variable
        os.environ["GEMINI_API_KEY"] = "AIzaSyByWvWkLKedG2WKnxtVhefQBRLZyrwf-tE"
        
        # Change to backend directory
        import sys
        sys.path.append('backend')
        
        # Import the API
        import infinite_memory_api
        print("✅ Infinite Memory API imported successfully")
        
        # Check if Gemini is configured
        if hasattr(infinite_memory_api, 'GEMINI_API_KEY') and infinite_memory_api.GEMINI_API_KEY:
            print(f"✅ GEMINI_API_KEY is set: {infinite_memory_api.GEMINI_API_KEY[:10]}...")
        else:
            print("❌ GEMINI_API_KEY is not set")
            
        if hasattr(infinite_memory_api, 'gemini_model') and infinite_memory_api.gemini_model:
            print("✅ Gemini model is configured")
        else:
            print("❌ Gemini model is not configured")
            
        return True
        
    except Exception as e:
        print(f"❌ Import Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main test function"""
    print("🔬 Local Gemini API Test")
    print("=" * 50)
    
    # Test 1: Direct Gemini API
    gemini_ok = test_gemini_api()
    
    # Test 2: Infinite Memory API import
    import_ok = test_infinite_memory_import()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"   Gemini API Direct: {'✅ PASS' if gemini_ok else '❌ FAIL'}")
    print(f"   Infinite Memory Import: {'✅ PASS' if import_ok else '❌ FAIL'}")
    
    if gemini_ok and import_ok:
        print("\n🎉 All tests passed! Ready to deploy!")
    else:
        print("\n⚠️ Some tests failed. Check the errors above.")
    
    return gemini_ok and import_ok

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
