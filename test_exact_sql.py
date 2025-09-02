#!/usr/bin/env python3
"""
Test exact SQL query
"""

import sys
import os
sys.path.append('backend')

def test_exact_sql():
    print("🔍 Testing Exact SQL Query...")
    
    try:
        from infinite_memory_api import get_db_connection
        import sqlite3
        
        conn = get_db_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get the exact content
        cursor.execute('SELECT content FROM memories WHERE user_id = ?', ('test_user',))
        result = cursor.fetchone()
        if result:
            content = result['content']
            print(f'Exact content: "{content}"')
            print(f'Content length: {len(content)}')
            print(f'Content contains "python": {"python" in content.lower()}')
            print(f'Content contains "Python": {"Python" in content}')
            
            # Test LIKE query with exact content
            cursor.execute('SELECT * FROM memories WHERE user_id = ? AND content LIKE ?', 
                         ('test_user', '%python%'))
            results = cursor.fetchall()
            print(f'LIKE query results: {len(results)}')
            
            # Test case-insensitive search
            cursor.execute('SELECT * FROM memories WHERE user_id = ? AND LOWER(content) LIKE ?', 
                         ('test_user', '%python%'))
            results = cursor.fetchall()
            print(f'Case-insensitive LIKE query results: {len(results)}')
        else:
            print('No memory found for test_user')
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_exact_sql()
