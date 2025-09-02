#!/usr/bin/env python3
"""
Simple test server to verify FastAPI is working
"""

from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Simple Test Server")

@app.get("/")
async def root():
    return {"message": "Simple test server is working!", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "healthy", "message": "Server is running"}

if __name__ == "__main__":
    print("🚀 Starting simple test server...")
    uvicorn.run(app, host="127.0.0.1", port=8003, log_level="info")
