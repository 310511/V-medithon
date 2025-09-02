#!/usr/bin/env python3
"""
Test the get_all_user_data function directly
"""

import sys
import os
sys.path.append('backend')

def test_get_all_user_data():
    print("Testing get_all_user_data function...")
    
    try:
        # Import the function
        from infinite_memory_api import get_all_user_data
        print("✅ Function imported successfully")
        
        # Test with a user ID
        user_id = "test_user_123"
        print(f"Testing with user_id: {user_id}")
        
        user_data = get_all_user_data(user_id)
        print(f"✅ Function executed successfully")
        print(f"Memories: {len(user_data['memories'])}")
        print(f"Conversations: {len(user_data['conversations'])}")
        print(f"Tasks: {len(user_data['tasks'])}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_get_all_user_data()
