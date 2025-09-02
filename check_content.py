#!/usr/bin/env python3
"""
Check actual content in database
"""

import sys
import os
sys.path.append('backend')

def check_content():
    print("🔍 Checking Actual Content in Database...")
    
    try:
        from infinite_memory_api import get_db_connection
        import sqlite3
        
        conn = get_db_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get the actual content
        cursor.execute('SELECT content, summary FROM memories WHERE user_id = ?', ('server_test_user',))
        results = cursor.fetchall()
        print('Actual content in database:')
        for result in results:
            content = result['content']
            summary = result['summary']
            print(f'  Content: {content}')
            print(f'  Summary: {summary}')
            print(f'  Content contains python: {"python" in content.lower()}')
            print(f'  Content contains Python: {"Python" in content}')
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    check_content()
