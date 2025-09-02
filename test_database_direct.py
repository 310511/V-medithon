#!/usr/bin/env python3
"""
Test database directly to debug the issue
"""

import sys
import os
import sqlite3
sys.path.append('backend')

def test_database_direct():
    print("🔍 Testing Database Directly...")
    
    try:
        # Import the function
        from infinite_memory_api import init_database, get_db_connection
        print("✅ Functions imported successfully")
        
        # Initialize database
        init_database()
        print("✅ Database initialized")
        
        # Connect to database directly
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if memories table exists and has data
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='memories'")
        table_exists = cursor.fetchone()
        print(f"✅ Memories table exists: {table_exists is not None}")
        
        if table_exists:
            # Count total memories
            cursor.execute("SELECT COUNT(*) FROM memories")
            total_memories = cursor.fetchone()[0]
            print(f"✅ Total memories in database: {total_memories}")
            
            # Get all memories
            cursor.execute("SELECT user_id, content, summary FROM memories LIMIT 10")
            memories = cursor.fetchall()
            print(f"✅ Sample memories:")
            for i, memory in enumerate(memories):
                print(f"   Memory {i+1}:")
                print(f"     User ID: {memory[0]}")
                print(f"     Content: {memory[1][:100]}...")
                print(f"     Summary: {memory[2]}")
            
            # Check for specific user
            cursor.execute("SELECT COUNT(*) FROM memories WHERE user_id = 'debug_user'")
            debug_user_memories = cursor.fetchone()[0]
            print(f"✅ Memories for debug_user: {debug_user_memories}")
            
            # Check for test_user_enhanced
            cursor.execute("SELECT COUNT(*) FROM memories WHERE user_id = 'test_user_enhanced'")
            enhanced_user_memories = cursor.fetchone()[0]
            print(f"✅ Memories for test_user_enhanced: {enhanced_user_memories}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_database_direct()
