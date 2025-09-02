#!/usr/bin/env python3
"""
Test saving memory directly
"""

import sys
import os
sys.path.append('backend')

def test_save_memory():
    print("🔍 Testing Save Memory Function...")
    
    try:
        # Import the functions
        from infinite_memory_api import init_database, save_memory, analyze_text, get_memories
        print("✅ Functions imported successfully")
        
        # Initialize database
        init_database()
        print("✅ Database initialized")
        
        # Test text analysis
        test_text = "I love programming in Python and building web applications with React."
        print(f"✅ Testing with text: {test_text}")
        
        analysis = analyze_text(test_text)
        print(f"✅ Analysis completed:")
        print(f"   Summary: {analysis.summary}")
        print(f"   Importance: {analysis.importance_score}")
        print(f"   Topics: {analysis.topics}")
        print(f"   Entities: {analysis.entities}")
        
        # Save memory
        memory_id = save_memory("test_user", test_text, "text", analysis)
        print(f"✅ Memory saved with ID: {memory_id}")
        
        # Retrieve memories
        memories = get_memories("test_user", 10)
        print(f"✅ Retrieved {len(memories)} memories")
        
        for i, memory in enumerate(memories):
            print(f"   Memory {i+1}:")
            print(f"     ID: {memory.get('id', 'N/A')}")
            print(f"     Summary: {memory.get('summary', 'N/A')}")
            print(f"     Content: {memory.get('content', 'N/A')[:100]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_save_memory()
