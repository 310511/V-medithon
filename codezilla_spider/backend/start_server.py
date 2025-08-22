#!/usr/bin/env python3
"""
Startup script for the EchoMed backend server
"""

import os
import sys

# Set the OpenAI API key
# Load environment variables from .env file if it exists
from dotenv import load_dotenv
load_dotenv()

# Set OpenAI API key from environment variable
if not os.environ.get('OPENAI_API_KEY'):
    os.environ['OPENAI_API_KEY'] = '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'

# Set other required environment variables
os.environ['AWS_ACCESS_KEY_ID'] = 'dummy'
os.environ['AWS_SECRET_ACCESS_KEY'] = 'dummy'
os.environ['AWS_REGION_NAME'] = 'us-east-1'
# Set ElevenLabs API key from environment variable
if not os.environ.get('ELEVENLABS_API_KEY'):
    os.environ['ELEVENLABS_API_KEY'] = 'dummy'
os.environ['BEDROCK_MODEL_ID'] = 'anthropic.claude-3-opus-20240229-v1:0'
os.environ['BEDROCK_SYNTHESIS_MODEL_ID'] = 'anthropic.claude-3-haiku-20240307-v1:0'
os.environ['KENDRA_INDEX_ID'] = 'dummy'
os.environ['NEPTUNE_ENDPOINT'] = 'dummy'
os.environ['S3_BUCKET_NAME'] = 'dummy'
os.environ['DYNAMODB_SPEAKERS_TABLE_NAME'] = 'dummy'
os.environ['HUGGING_FACE_TOKEN'] = 'dummy'
os.environ['DYNAMODB_ANALYTICS_TABLE_NAME'] = 'dummy'
os.environ['DYNAMODB_ALERTS_TABLE_NAME'] = 'dummy'
os.environ['DYNAMODB_TASKS_TABLE_NAME'] = 'dummy'

print("Starting EchoMed Backend Server...")
print("OpenAI API Key configured:", os.environ.get('OPENAI_API_KEY', 'Not set')[:20] + "...")

# Import and run the main application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
