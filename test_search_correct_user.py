#!/usr/bin/env python3
"""
Test search function with correct user
"""

import sys
import os
sys.path.append('backend')

def test_search_correct_user():
    print("🔍 Testing Search Function with Correct User...")
    
    try:
        from infinite_memory_api import init_database, search_memories, extract_keywords
        print("✅ Functions imported successfully")
        
        # Initialize database
        init_database()
        print("✅ Database initialized")
        
        # Test with the correct user_id
        user_id = "test_user"
        test_queries = ["Python", "programming", "React", "web applications", "love"]
        
        for query in test_queries:
            print(f"\n--- Testing query: '{query}' for user: {user_id} ---")
            
            # Test keyword extraction
            keywords = extract_keywords(query)
            print(f"   Extracted keywords: {keywords}")
            
            # Test search
            memories = search_memories(user_id, query)
            print(f"   Found {len(memories)} memories")
            
            for i, memory in enumerate(memories):
                print(f"   Memory {i+1}:")
                print(f"     Summary: {memory.get('summary', 'N/A')}")
                print(f"     Content: {memory.get('content', 'N/A')[:100]}...")
                print(f"     Relevance Score: {memory.get('relevance_score', 0)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_search_correct_user()
