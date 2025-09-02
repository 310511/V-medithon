#!/usr/bin/env python3
"""
Test search function directly
"""

import sys
import os
sys.path.append('backend')

def test_search_function():
    print("🔍 Testing Search Function Directly...")
    
    try:
        # Import the functions
        from infinite_memory_api import init_database, search_memories, extract_keywords
        print("✅ Functions imported successfully")
        
        # Initialize database
        init_database()
        print("✅ Database initialized")
        
        # Test keyword extraction
        test_queries = ["Python", "programming", "React", "web applications", "love"]
        
        for query in test_queries:
            print(f"\n--- Testing query: '{query}' ---")
            
            # Test keyword extraction
            keywords = extract_keywords(query)
            print(f"   Extracted keywords: {keywords}")
            
            # Test search
            memories = search_memories("server_test_user", query)
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
    test_search_function()
