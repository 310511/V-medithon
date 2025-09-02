#!/usr/bin/env python3
"""
Test SQL query directly
"""

import sys
import os
import sqlite3
sys.path.append('backend')

def test_sql_query():
    print("🔍 Testing SQL Query Directly...")
    
    try:
        # Import the functions
        from infinite_memory_api import init_database, get_db_connection
        print("✅ Functions imported successfully")
        
        # Initialize database
        init_database()
        print("✅ Database initialized")
        
        # Connect to database
        conn = get_db_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Test simple query
        print("\n1. Testing simple query...")
        cursor.execute("SELECT * FROM memories WHERE user_id = ?", ("server_test_user",))
        memories = cursor.fetchall()
        print(f"✅ Found {len(memories)} memories for server_test_user")
        
        for memory in memories:
            print(f"   Memory:")
            print(f"     Content: {memory['content']}")
            print(f"     Summary: {memory['summary']}")
            print(f"     Topics: {memory['topics']}")
            print(f"     Entities: {memory['entities']}")
        
        # Test LIKE query
        print("\n2. Testing LIKE query...")
        test_keywords = ["python", "programming", "react", "love"]
        
        for keyword in test_keywords:
            print(f"\n   Testing keyword: '{keyword}'")
            
            # Test content LIKE
            cursor.execute("SELECT * FROM memories WHERE user_id = ? AND content LIKE ?", 
                         ("server_test_user", f"%{keyword}%"))
            content_matches = cursor.fetchall()
            print(f"     Content matches: {len(content_matches)}")
            
            # Test summary LIKE
            cursor.execute("SELECT * FROM memories WHERE user_id = ? AND summary LIKE ?", 
                         ("server_test_user", f"%{keyword}%"))
            summary_matches = cursor.fetchall()
            print(f"     Summary matches: {len(summary_matches)}")
            
            # Test topics LIKE
            cursor.execute("SELECT * FROM memories WHERE user_id = ? AND topics LIKE ?", 
                         ("server_test_user", f"%{keyword}%"))
            topics_matches = cursor.fetchall()
            print(f"     Topics matches: {len(topics_matches)}")
            
            # Test entities LIKE
            cursor.execute("SELECT * FROM memories WHERE user_id = ? AND entities LIKE ?", 
                         ("server_test_user", f"%{keyword}%"))
            entities_matches = cursor.fetchall()
            print(f"     Entities matches: {len(entities_matches)}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_sql_query()
