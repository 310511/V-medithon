#!/usr/bin/env python3
"""
Infinite Memory API with Permanent Data Storage
- SQLite database for persistent storage
- Enhanced memory management
- Task management with persistence
- Analytics and reporting
"""

import sys
import os
from typing import Optional, List, Dict, Any
import json
import sqlite3
from datetime import datetime, timedelta
import uuid
import hashlib
import re
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
import uvicorn
import google.generativeai as genai

# Initialize FastAPI app
app = FastAPI(title="Infinite Memory API with Permanent Storage", version="3.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration
DATABASE_PATH = "infinite_memory.db"

# Gemini API configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
else:
    gemini_model = None

# Pydantic models
class ProcessTextRequest(BaseModel):
    user_id: str
    text: str

class QueryRequest(BaseModel):
    user_id: str
    query: str

class GeminiQueryRequest(BaseModel):
    user_id: str
    query: str
    include_summary: bool = True

class ProcessAudioRequest(BaseModel):
    user_id: str
    filepath: str

class TextToSpeechRequest(BaseModel):
    text: str
    user_id: str

class CreateTaskRequest(BaseModel):
    patient_id: str
    summary: str
    start_date: str
    end_date: str
    description: Optional[str] = ""

class MarkTaskCompletedRequest(BaseModel):
    patient_id: str
    task_id: str

class MemoryAnalysis(BaseModel):
    importance_score: float
    summary: str
    entities: List[str]
    sentiment: str
    topics: List[str]
    action_items: Optional[List[str]] = []
    urgency_level: Optional[str] = "medium"
    error: Optional[str] = None

class Task(BaseModel):
    task_id: str
    patient_id: str
    summary: str
    description: str
    start_date: str
    end_date: str
    completed: bool
    created_at: str
    priority: Optional[str] = "medium"

class MemoryReport(BaseModel):
    patient_id: str
    days: int
    total_interactions: int
    average_importance: float
    memory_trends: List[Dict[str, Any]]
    recent_activities: List[Dict[str, Any]]
    sentiment_distribution: Optional[Dict[str, int]] = {}

# Database initialization
def init_database():
    """Initialize the SQLite database with required tables"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Create memories table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS memories (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            content TEXT NOT NULL,
            content_type TEXT NOT NULL, -- 'text', 'image', 'audio'
            importance_score REAL NOT NULL,
            summary TEXT NOT NULL,
            entities TEXT, -- JSON array
            sentiment TEXT NOT NULL,
            topics TEXT, -- JSON array
            action_items TEXT, -- JSON array
            urgency_level TEXT DEFAULT 'medium',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create tasks table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            task_id TEXT PRIMARY KEY,
            patient_id TEXT NOT NULL,
            summary TEXT NOT NULL,
            description TEXT,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            priority TEXT DEFAULT 'medium',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create analytics table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analytics (
            id TEXT PRIMARY KEY,
            patient_id TEXT NOT NULL,
            metric_name TEXT NOT NULL,
            metric_value REAL NOT NULL,
            metadata TEXT, -- JSON object
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create conversations table for chat history
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            message_type TEXT NOT NULL, -- 'user', 'ai'
            content TEXT NOT NULL,
            analysis_id TEXT, -- Reference to memories table
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (analysis_id) REFERENCES memories (id)
        )
    ''')
    
    # Create indexes for better performance
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_memories_user_id ON memories(user_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_tasks_patient_id ON tasks(patient_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_analytics_patient_id ON analytics(patient_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id)')
    
    conn.commit()
    conn.close()
    print("Database initialized successfully")

# Database helper functions
def get_db_connection():
    """Get database connection"""
    return sqlite3.connect(DATABASE_PATH)

def save_memory(user_id: str, content: str, content_type: str, analysis: MemoryAnalysis) -> str:
    """Save memory to database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    memory_id = str(uuid.uuid4())
    
    cursor.execute('''
        INSERT INTO memories (
            id, user_id, content, content_type, importance_score, summary,
            entities, sentiment, topics, action_items, urgency_level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        memory_id, user_id, content, content_type, analysis.importance_score,
        analysis.summary, json.dumps(analysis.entities), analysis.sentiment,
        json.dumps(analysis.topics), json.dumps(analysis.action_items or []),
        analysis.urgency_level
    ))
    
    conn.commit()
    conn.close()
    return memory_id

def get_memories(user_id: str, limit: int = 100) -> List[Dict[str, Any]]:
    """Get memories for a user"""
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM memories 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ?
    ''', (user_id, limit))
    
    memories = []
    for row in cursor.fetchall():
        memory = dict(row)
        memory['entities'] = json.loads(memory['entities'] or '[]')
        memory['topics'] = json.loads(memory['topics'] or '[]')
        memory['action_items'] = json.loads(memory['action_items'] or '[]')
        memories.append(memory)
    
    conn.close()
    return memories

def extract_keywords(query: str) -> List[str]:
    """Extract important keywords from user query"""
    # Remove common stop words
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
        'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
        'will', 'would', 'could', 'should', 'may', 'might', 'can', 'what', 'when', 'where',
        'why', 'how', 'who', 'which', 'that', 'this', 'these', 'those', 'i', 'you', 'he',
        'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his',
        'her', 'its', 'our', 'their', 'about', 'from', 'into', 'through', 'during', 'before',
        'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again',
        'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
        'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
        'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will',
        'just', 'don', 'should', 'now'
    }
    
    # Clean and split query
    words = re.findall(r'\b\w+\b', query.lower())
    
    # Filter out stop words and short words, keep important terms
    keywords = []
    for word in words:
        if word not in stop_words and len(word) > 2:
            keywords.append(word)
    
    # If no keywords found, use the original query
    return keywords if keywords else [query.lower()]

def search_memories(user_id: str, query: str) -> List[Dict[str, Any]]:
    """Enhanced search memories using keyword matching and relevance scoring"""
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Extract keywords from query
    keywords = extract_keywords(query)
    
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
    # Parameters: relevance scoring parameters + user_id + all search parameters
    relevance_params = [f'%{query}%', f'%{query}%', f'%{query}%']
    all_params = relevance_params + search_params
    
    cursor.execute(f'''
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
    ''', all_params)
    
    memories = []
    for row in cursor.fetchall():
        memory = dict(row)
        memory['entities'] = json.loads(memory['entities'] or '[]')
        memory['topics'] = json.loads(memory['topics'] or '[]')
        memory['action_items'] = json.loads(memory['action_items'] or '[]')
        memories.append(memory)
    
    conn.close()
    return memories

def save_conversation(user_id: str, message_type: str, content: str, analysis_id: str = None):
    """Save conversation entry"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    conversation_id = str(uuid.uuid4())
    
    cursor.execute('''
        INSERT INTO conversations (id, user_id, message_type, content, analysis_id)
        VALUES (?, ?, ?, ?, ?)
    ''', (conversation_id, user_id, message_type, content, analysis_id))
    
    conn.commit()
    conn.close()
    return conversation_id

def get_conversation_history(user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
    """Get conversation history for a user"""
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM conversations 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ?
    ''', (user_id, limit))
    
    conversations = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return conversations

def get_all_user_data(user_id: str) -> Dict[str, Any]:
    """Get all user data for Gemini processing"""
    # Ensure database is initialized
    init_database()
    
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Get memories
    cursor.execute('''
        SELECT * FROM memories 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    ''', (user_id,))
    memories = [dict(row) for row in cursor.fetchall()]
    
    # Get conversations
    cursor.execute('''
        SELECT * FROM conversations 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    ''', (user_id,))
    conversations = [dict(row) for row in cursor.fetchall()]
    
    # Get tasks
    cursor.execute('''
        SELECT * FROM tasks 
        WHERE patient_id = ? 
        ORDER BY created_at DESC
    ''', (user_id,))
    tasks = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    
    return {
        "memories": memories,
        "conversations": conversations,
        "tasks": tasks
    }

# AI Analysis Functions (Simplified for demo)
def analyze_text(text: str) -> MemoryAnalysis:
    """Analyze text and extract insights"""
    # Simple analysis - in production, use proper NLP models
    
    # Calculate importance score based on text length and keywords
    importance_keywords = ['important', 'urgent', 'critical', 'remember', 'note', 'task', 'deadline']
    importance_score = min(1.0, len(text) / 200.0 + sum(0.1 for word in importance_keywords if word in text.lower()))
    
    # Extract entities (simple keyword extraction)
    entities = []
    medical_terms = ['medicine', 'doctor', 'hospital', 'pain', 'fever', 'headache', 'medicine', 'prescription']
    for term in medical_terms:
        if term in text.lower():
            entities.append(term)
    
    # Determine sentiment
    positive_words = ['good', 'great', 'excellent', 'happy', 'better', 'improved']
    negative_words = ['bad', 'terrible', 'pain', 'hurt', 'sick', 'worse']
    
    sentiment = 'neutral'
    if any(word in text.lower() for word in positive_words):
        sentiment = 'positive'
    elif any(word in text.lower() for word in negative_words):
        sentiment = 'negative'
    
    # Extract topics
    topics = []
    if any(word in text.lower() for word in ['medicine', 'prescription', 'drug']):
        topics.append('medicine')
    if any(word in text.lower() for word in ['appointment', 'visit', 'doctor']):
        topics.append('appointment')
    if any(word in text.lower() for word in ['pain', 'symptom', 'condition']):
        topics.append('health')
    
    # Extract action items
    action_items = []
    if 'remind' in text.lower() or 'remember' in text.lower():
        action_items.append('Set reminder')
    if 'call' in text.lower() or 'contact' in text.lower():
        action_items.append('Make contact')
    
    # Determine urgency
    urgency_level = 'medium'
    if any(word in text.lower() for word in ['urgent', 'asap', 'immediately', 'emergency']):
        urgency_level = 'high'
    elif any(word in text.lower() for word in ['later', 'sometime', 'when possible']):
        urgency_level = 'low'
    
    return MemoryAnalysis(
        importance_score=importance_score,
        summary=text[:100] + "..." if len(text) > 100 else text,
        entities=entities,
        sentiment=sentiment,
        topics=topics,
        action_items=action_items,
        urgency_level=urgency_level
    )

# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Infinite Memory API with Permanent Storage",
        "version": "3.0.0",
        "status": "running",
        "database": "SQLite",
        "features": [
            "Persistent memory storage",
            "Task management",
            "Conversation history",
            "Analytics and reporting",
            "Text and image processing"
        ]
    }

@app.post("/process-text", response_model=MemoryAnalysis)
async def process_text(request: ProcessTextRequest):
    """Process text input and store in memory"""
    try:
        # Analyze the text
        analysis = analyze_text(request.text)
        
        # Save to database
        memory_id = save_memory(
            user_id=request.user_id,
            content=request.text,
            content_type='text',
            analysis=analysis
        )
        
        # Save conversation entry
        save_conversation(
            user_id=request.user_id,
            message_type='user',
            content=request.text,
            analysis_id=memory_id
        )
        
        # Save AI response
        save_conversation(
            user_id=request.user_id,
            message_type='ai',
            content=analysis.summary
        )
        
        return analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
async def query_memory(request: QueryRequest):
    """Enhanced query stored memories with structured response format"""
    try:
        # Extract keywords from the query
        matched_keywords = extract_keywords(request.query)
        
        # Search memories using enhanced keyword matching
        memories = search_memories(request.user_id, request.query)
        
        # Prepare structured response
        if not memories:
            final_answer = "I couldn't find anything in memory related to that."
            retrieved_memory = None
        else:
            # Get the most relevant memory (highest relevance score)
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
            
            # Generate a clear, concise answer
            if len(memories) == 1:
                final_answer = f"Based on your memory: {best_memory['summary']}"
            else:
                # Multiple relevant memories found
                answer_parts = [f"Based on your memories, I found {len(memories)} relevant entries:"]
                for i, memory in enumerate(memories[:3], 1):
                    answer_parts.append(f"{i}. {memory['summary']}")
                final_answer = " ".join(answer_parts)
        
        # Save query to conversation
        save_conversation(
            user_id=request.user_id,
            message_type='user',
            content=request.query
        )
        
        # Save response to conversation
        save_conversation(
            user_id=request.user_id,
            message_type='ai',
            content=final_answer
        )
        
        return {
            "matched_keywords": matched_keywords,
            "retrieved_memory": retrieved_memory,
            "final_answer": final_answer,
            "total_matches": len(memories),
            "all_memories": memories[:5] if memories else []  # Include top 5 for context
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query-gemini")
async def query_memory_with_gemini(request: GeminiQueryRequest):
    """Query stored memories using Gemini AI with structured response format"""
    try:
        print(f"Gemini query request: {request.query} for user: {request.user_id}")
        
        if not gemini_model:
            raise HTTPException(status_code=503, detail="Gemini API not configured. Please set GEMINI_API_KEY environment variable.")
        
        # Extract keywords from the query
        matched_keywords = extract_keywords(request.query)
        
        # First, search for relevant memories using enhanced keyword search
        print("Searching for relevant memories...")
        relevant_memories = search_memories(request.user_id, request.query)
        print(f"Found {len(relevant_memories)} relevant memories")
        
        # Get additional context if needed
        user_data = get_all_user_data(request.user_id)
        print(f"User data retrieved: {len(user_data['memories'])} total memories, {len(user_data['conversations'])} conversations, {len(user_data['tasks'])} tasks")
        
        # Prepare context for Gemini with relevant memories prioritized
        context_parts = []
        
        # Add most relevant memories first
        if relevant_memories:
            context_parts.append("=== MOST RELEVANT MEMORIES ===")
            for memory in relevant_memories[:5]:  # Top 5 most relevant
                context_parts.append(f"Relevant Memory: {memory['summary']} (Relevance: {memory.get('relevance_score', 0)}, Importance: {memory['importance_score']})")
                if memory.get('topics'):
                    context_parts.append(f"  Topics: {', '.join(memory['topics'])}")
        
        # Add recent memories for additional context
        if user_data["memories"] and len(relevant_memories) < 5:
            context_parts.append("=== RECENT MEMORIES ===")
            recent_memories = [m for m in user_data["memories"][:5] if m not in relevant_memories]
            for memory in recent_memories:
                context_parts.append(f"Recent Memory: {memory['summary']} (Importance: {memory['importance_score']})")
        
        # Add conversations
        if user_data["conversations"]:
            context_parts.append("\n=== CONVERSATIONS ===")
            for conv in user_data["conversations"][:10]:  # Limit to recent conversations
                context_parts.append(f"{conv['message_type'].upper()}: {conv['content']}")
        
        # Add tasks
        if user_data["tasks"]:
            context_parts.append("\n=== TASKS ===")
            for task in user_data["tasks"][:5]:  # Limit to recent tasks
                status = "Completed" if task['completed'] else "Pending"
                context_parts.append(f"Task: {task['summary']} - {status}")
        
        context = "\n".join(context_parts)
        
        # Create Gemini prompt with structured format request
        prompt = f"""You are an AI assistant with access to a user's personal memory data. Based on the following information, please answer the user's question intelligently and provide helpful insights.

USER DATA:
{context}

USER QUESTION: {request.query}

Please provide a comprehensive and helpful response based on the available data. If the question requires information not in the data, please say so clearly. If you can provide insights or patterns from the data, please do so.

Format your response as:
- Matched Keywords: {matched_keywords}
- Retrieved Memory: (if any relevant memory found)
- Final Answer: (clear, concise, and direct answer to the question)

If no relevant memory is found, say: "I couldn't find anything in memory related to that."""

        # Generate response with Gemini
        response = gemini_model.generate_content(prompt)
        answer = response.text
        
        # Prepare retrieved memory information
        retrieved_memory = None
        if relevant_memories:
            best_memory = relevant_memories[0]
            retrieved_memory = {
                "summary": best_memory['summary'],
                "content": best_memory['content'][:200] + "..." if len(best_memory['content']) > 200 else best_memory['content'],
                "topics": best_memory['topics'],
                "entities": best_memory['entities'],
                "importance_score": best_memory['importance_score'],
                "relevance_score": best_memory.get('relevance_score', 0),
                "created_at": best_memory['created_at']
            }
        
        # Save query to conversation
        save_conversation(
            user_id=request.user_id,
            message_type='user',
            content=request.query
        )
        
        # Save response to conversation
        save_conversation(
            user_id=request.user_id,
            message_type='ai',
            content=answer
        )
        
        # Generate summary if requested
        summary = None
        if request.include_summary and user_data["memories"]:
            summary_prompt = f"""Based on the following user data, provide a brief summary of key insights and patterns:

{context}

Please provide a concise summary highlighting:
1. Main topics of interest
2. Recent activities or concerns
3. Any notable patterns or trends"""

            summary_response = gemini_model.generate_content(summary_prompt)
            summary = summary_response.text
        
        return {
            "matched_keywords": matched_keywords,
            "retrieved_memory": retrieved_memory,
            "final_answer": answer,
            "summary": summary,
            "total_matches": len(relevant_memories),
            "data_points": {
                "memories_count": len(user_data["memories"]),
                "conversations_count": len(user_data["conversations"]),
                "tasks_count": len(user_data["tasks"])
            }
        }
        
    except Exception as e:
        print(f"Error in Gemini endpoint: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process-image", response_model=MemoryAnalysis)
async def process_image(
    user_id: str = Form(...),
    caption: str = Form(""),
    image: UploadFile = File(...)
):
    """Process image and store in memory"""
    try:
        # Read image data
        image_data = await image.read()
        
        # Simple image analysis (in production, use proper image analysis)
        analysis = MemoryAnalysis(
            importance_score=0.7,
            summary=f"Processed image: {image.filename} with caption: {caption}",
            entities=["image", "visual"],
            sentiment="neutral",
            topics=["visual_content"],
            action_items=["Review image"],
            urgency_level="medium"
        )
        
        # Save to database
        memory_id = save_memory(
            user_id=user_id,
            content=f"Image: {image.filename}, Caption: {caption}",
            content_type='image',
            analysis=analysis
        )
        
        # Save conversation entry
        save_conversation(
            user_id=user_id,
            message_type='user',
            content=f"Uploaded image: {image.filename}",
            analysis_id=memory_id
        )
        
        return analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tasks/create", response_model=Task)
async def create_task(request: CreateTaskRequest):
    """Create a new task"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        task_id = str(uuid.uuid4())
        
        cursor.execute('''
            INSERT INTO tasks (task_id, patient_id, summary, description, start_date, end_date)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            task_id, request.patient_id, request.summary, 
            request.description, request.start_date, request.end_date
        ))
        
        conn.commit()
        conn.close()
        
        # Return the created task
        return Task(
            task_id=task_id,
            patient_id=request.patient_id,
            summary=request.summary,
            description=request.description,
            start_date=request.start_date,
            end_date=request.end_date,
            completed=False,
            created_at=datetime.now().isoformat(),
            priority="medium"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/tasks/{patient_id}", response_model=List[Task])
async def get_tasks(patient_id: str):
    """Get tasks for a patient"""
    try:
        conn = get_db_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM tasks 
            WHERE patient_id = ? 
            ORDER BY created_at DESC
        ''', (patient_id,))
        
        tasks = []
        for row in cursor.fetchall():
            task = dict(row)
            tasks.append(Task(**task))
        
        conn.close()
        return tasks
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tasks/complete")
async def complete_task(request: MarkTaskCompletedRequest):
    """Mark a task as completed"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE tasks 
            SET completed = TRUE, updated_at = CURRENT_TIMESTAMP
            WHERE task_id = ? AND patient_id = ?
        ''', (request.task_id, request.patient_id))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        
        conn.commit()
        conn.close()
        
        return {"message": "Task completed successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/memory-report/{patient_id}", response_model=MemoryReport)
async def get_memory_report(patient_id: str, days: int = 3):
    """Get memory analytics report"""
    try:
        conn = get_db_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get memories from the last N days
        start_date = datetime.now() - timedelta(days=days)
        
        cursor.execute('''
            SELECT * FROM memories 
            WHERE user_id = ? AND created_at >= ?
            ORDER BY created_at DESC
        ''', (patient_id, start_date.isoformat()))
        
        memories = [dict(row) for row in cursor.fetchall()]
        
        # Calculate statistics
        total_interactions = len(memories)
        average_importance = sum(m['importance_score'] for m in memories) / total_interactions if total_interactions > 0 else 0
        
        # Sentiment distribution
        sentiment_dist = {}
        for memory in memories:
            sentiment = memory['sentiment']
            sentiment_dist[sentiment] = sentiment_dist.get(sentiment, 0) + 1
        
        # Memory trends (daily counts)
        memory_trends = []
        for i in range(days):
            date = (datetime.now() - timedelta(days=i)).date()
            count = sum(1 for m in memories if m['created_at'].startswith(date.isoformat()))
            memory_trends.append({
                "date": date.isoformat(),
                "count": count
            })
        
        # Recent activities
        recent_activities = memories[:10]  # Last 10 memories
        
        conn.close()
        
        return MemoryReport(
            patient_id=patient_id,
            days=days,
            total_interactions=total_interactions,
            average_importance=average_importance,
            memory_trends=memory_trends,
            recent_activities=recent_activities,
            sentiment_distribution=sentiment_dist
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/conversation-history/{user_id}")
async def get_conversation_history_endpoint(user_id: str, limit: int = 50):
    """Get conversation history for a user"""
    try:
        conversations = get_conversation_history(user_id, limit)
        return {"conversations": conversations}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/memories/{user_id}")
async def get_memories_endpoint(user_id: str, limit: int = 100):
    """Get all memories for a user"""
    try:
        memories = get_memories(user_id, limit)
        return {"memories": memories}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_database()
    print("Infinite Memory API with Permanent Storage started!")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)

