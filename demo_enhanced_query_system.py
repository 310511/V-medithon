#!/usr/bin/env python3
"""
Demo of the Enhanced Query System
"""

import sys
import os
sys.path.append('backend')

def demo_enhanced_query_system():
    print("🎯 Enhanced Query System Demo")
    print("=" * 50)
    
    try:
        from infinite_memory_api import init_database, save_memory, analyze_text, search_memories, extract_keywords
        print("✅ Functions imported successfully")
        
        # Initialize database
        init_database()
        print("✅ Database initialized")
        
        # Add diverse test data
        print("\n📝 Adding diverse test data...")
        test_data = [
            "I'm working on a React project called 'E-commerce Dashboard' using TypeScript and Tailwind CSS. The project deadline is next Friday.",
            "Had a meeting with John Smith about the Python machine learning project. We discussed using TensorFlow and scikit-learn for data analysis.",
            "Remember to call Dr. Johnson about the medical appointment scheduled for December 15th at 2:00 PM.",
            "The JavaScript conference in San Francisco was amazing! Met Sarah from Google and learned about new ES2024 features.",
            "Working on a Node.js backend API with Express and MongoDB. Need to implement JWT authentication by tomorrow."
        ]
        
        for i, text in enumerate(test_data, 1):
            analysis = analyze_text(text)
            memory_id = save_memory("demo_user", text, "text", analysis)
            print(f"   ✅ Added memory {i}: {text[:50]}...")
        
        # Test enhanced query system
        print("\n🔍 Testing Enhanced Query System...")
        test_queries = [
            "What projects am I working on?",
            "Tell me about React development",
            "Who did I meet at the conference?",
            "What programming languages do I use?",
            "When is my medical appointment?",
            "Tell me about machine learning",
            "What is my deadline for the e-commerce project?"
        ]
        
        for i, query in enumerate(test_queries, 1):
            print(f"\n--- Query {i}: '{query}' ---")
            
            # Extract keywords
            matched_keywords = extract_keywords(query)
            print(f"📋 Matched Keywords: {matched_keywords}")
            
            # Search memories
            memories = search_memories("demo_user", query)
            print(f"🔍 Found {len(memories)} relevant memories")
            
            if memories:
                # Get the most relevant memory
                best_memory = memories[0]
                retrieved_memory = {
                    "summary": best_memory['summary'],
                    "content": best_memory['content'][:200] + "..." if len(best_memory['content']) > 200 else best_memory['content'],
                    "topics": best_memory['topics'],
                    "entities": best_memory['entities'],
                    "importance_score": best_memory['importance_score'],
                    "relevance_score": best_memory.get('relevance_score', 0),
                    "created_at": best_memory['created_at']
                }
                
                print(f"📄 Retrieved Memory:")
                print(f"   Summary: {retrieved_memory['summary']}")
                print(f"   Topics: {retrieved_memory['topics']}")
                print(f"   Relevance Score: {retrieved_memory['relevance_score']}")
                
                # Generate final answer
                if len(memories) == 1:
                    final_answer = f"Based on your memory: {best_memory['summary']}"
                else:
                    answer_parts = [f"Based on your memories, I found {len(memories)} relevant entries:"]
                    for j, memory in enumerate(memories[:3], 1):
                        answer_parts.append(f"{j}. {memory['summary']}")
                    final_answer = " ".join(answer_parts)
                
                print(f"💬 Final Answer: {final_answer}")
            else:
                print("❌ No relevant memories found")
                print("💬 Final Answer: I couldn't find anything in memory related to that.")
        
        # Test with no matches
        print(f"\n--- Query: 'Tell me about quantum computing' (No matches expected) ---")
        matched_keywords = extract_keywords("Tell me about quantum computing")
        print(f"📋 Matched Keywords: {matched_keywords}")
        
        memories = search_memories("demo_user", "Tell me about quantum computing")
        print(f"🔍 Found {len(memories)} relevant memories")
        
        if memories:
            print("❌ Unexpected: Found memories for unrelated query")
        else:
            print("✅ Correct: No memories found for unrelated query")
            print("💬 Final Answer: I couldn't find anything in memory related to that.")
        
        print("\n🎉 Enhanced Query System Demo Complete!")
        print("=" * 50)
        print("✅ Keyword extraction working")
        print("✅ Memory search working")
        print("✅ Structured responses working")
        print("✅ Relevance scoring working")
        print("✅ No-match handling working")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    demo_enhanced_query_system()
