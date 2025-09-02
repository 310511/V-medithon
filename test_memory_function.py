#!/usr/bin/env python3
"""
Test the get_memories function directly
"""

import sys
import os
sys.path.append('backend')

def test_memory_function():
    print("Testing get_memories function...")
    
    try:
        # Import the function
        from infinite_memory_api import get_memories, init_database
        print("✅ Function imported successfully")
        
        # Initialize database
        init_database()
        print("✅ Database initialized")
        
        # Test with a user ID
        user_id = "debug_user"
        print(f"Testing with user_id: {user_id}")
        
        memories = get_memories(user_id, 10)
        print(f"✅ Function executed successfully")
        print(f"Memories found: {len(memories)}")
        
        for i, memory in enumerate(memories):
            print(f"Memory {i+1}:")
            print(f"  Summary: {memory.get('summary', 'N/A')}")
            print(f"  Content: {memory.get('content', 'N/A')[:100]}...")
            print(f"  Topics: {memory.get('topics', [])}")
            print(f"  Entities: {memory.get('entities', [])}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_memory_function()
