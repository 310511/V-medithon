#!/usr/bin/env python3
"""
Test search logic exactly as in the function
"""

import sys
import os
sys.path.append('backend')

def test_search_logic():
    print("🔍 Testing Search Logic Exactly...")
    
    try:
        from infinite_memory_api import get_db_connection, extract_keywords
        import sqlite3
        
        conn = get_db_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Replicate the exact logic from search_memories function
        user_id = "test_user"
        query = "Python"
        
        # Extract keywords from query
        keywords = extract_keywords(query)
        print(f"Extracted keywords: {keywords}")
        
        # Build search conditions for each keyword
        search_conditions = []
        search_params = []
        
        # Add the user_id parameter first
        search_params.append(user_id)
        
        # Search in content, summary, topics, and entities for each keyword
        for keyword in keywords:
            search_conditions.append('(content LIKE ? OR summary LIKE ? OR topics LIKE ? OR entities LIKE ?)')
            search_params.extend([f'%{keyword}%', f'%{keyword}%', f'%{keyword}%', f'%{keyword}%'])
        
        # If no keywords, search for the original query
        if not search_conditions:
            search_conditions.append('(content LIKE ? OR summary LIKE ? OR topics LIKE ? OR entities LIKE ?)')
            search_params.extend([f'%{query}%', f'%{query}%', f'%{query}%', f'%{query}%'])
        
        # Combine all conditions with OR
        where_clause = ' OR '.join(search_conditions)
        
        # Build the complete query with relevance scoring
        # Parameters: user_id + all search parameters + relevance scoring parameters
        relevance_params = [f'%{query}%', f'%{query}%', f'%{query}%']
        all_params = search_params + relevance_params
        
        print(f"Where clause: {where_clause}")
        print(f"Search params: {search_params}")
        print(f"All params: {all_params}")
        
        # Execute the query
        sql_query = f'''
            SELECT *, 
                   CASE 
                       WHEN content LIKE ? THEN 3
                       WHEN summary LIKE ? THEN 2
                       WHEN topics LIKE ? THEN 1
                       ELSE 0
                   END as relevance_score
            FROM memories 
            WHERE user_id = ? 
            AND ({where_clause})
            ORDER BY relevance_score DESC, importance_score DESC, created_at DESC
            LIMIT 20
        '''
        
        print(f"SQL query: {sql_query}")
        
        cursor.execute(sql_query, all_params)
        memories = []
        for row in cursor.fetchall():
            memory = dict(row)
            memory['entities'] = []  # Simplified for testing
            memory['topics'] = []    # Simplified for testing
            memory['action_items'] = []  # Simplified for testing
            memories.append(memory)
        
        print(f"Found {len(memories)} memories")
        for i, memory in enumerate(memories):
            print(f"  Memory {i+1}:")
            print(f"    Summary: {memory.get('summary', 'N/A')}")
            print(f"    Content: {memory.get('content', 'N/A')[:100]}...")
            print(f"    Relevance Score: {memory.get('relevance_score', 0)}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_search_logic()
