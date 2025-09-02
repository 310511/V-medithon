#!/usr/bin/env python3
"""
Check all memories in database
"""

import sys
import os
sys.path.append('backend')

def check_all_memories():
    print("🔍 Checking All Memories in Database...")
    
    try:
        from infinite_memory_api import get_db_connection
        import sqlite3
        
        conn = get_db_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get all memories
        cursor.execute('SELECT user_id, content, summary FROM memories LIMIT 10')
        results = cursor.fetchall()
        print(f'Found {len(results)} memories:')
        for i, result in enumerate(results):
            print(f'  Memory {i+1}:')
            print(f'    User ID: {result["user_id"]}')
            print(f'    Content: {result["content"][:100]}...')
            print(f'    Summary: {result["summary"]}')
        
        # Count by user
        cursor.execute('SELECT user_id, COUNT(*) FROM memories GROUP BY user_id')
        users = cursor.fetchall()
        print(f'\nMemories by user:')
        for user_id, count in users:
            print(f'  {user_id}: {count}')
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    check_all_memories()
