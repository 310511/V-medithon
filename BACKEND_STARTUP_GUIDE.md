# Backend Startup Guide

## Standardized Backend Startup

All backend servers now use the standardized startup command:

```bash
cd backend && python main.py
```

## Available Startup Methods

### 1. Command Line (Recommended)
```bash
cd backend && python main.py
```

### 2. Batch File (Windows)
```bash
start_backend.bat
```

### 3. PowerShell Script
```powershell
start_backend.ps1
```

### 4. Direct Python Execution
```bash
cd backend
python main.py
```

## What main.py Does

The `main.py` file:
- ✅ Checks if running from correct directory
- ✅ Imports the infinite_memory_api module
- ✅ Starts the uvicorn server on port 8001
- ✅ Provides clear error messages and logging
- ✅ Handles startup errors gracefully

## Server Information

- **URL**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs
- **Health Check**: http://localhost:8001/

## Available Endpoints

- `POST /process-text` - Process and store text
- `POST /query` - Query memories (basic)
- `POST /query-gemini` - Query memories with Gemini AI
- `GET /conversation-history/{user_id}` - Get conversation history
- `POST /tasks/create` - Create new tasks
- `GET /tasks/{patient_id}` - Get user tasks
- `GET /memory-report/{patient_id}` - Get memory analytics

## Troubleshooting

### Port Already in Use
If port 8001 is already in use:
```bash
# Kill existing Python processes
taskkill /F /IM python.exe

# Then start the server
cd backend && python main.py
```

### Import Errors
Make sure you're in the correct directory:
```bash
# Check if infinite_memory_api.py exists
ls backend/infinite_memory_api.py

# If not found, navigate to the correct directory
cd shine2/backend && python main.py
```

### Unicode Errors
The server now handles Unicode encoding properly for Windows console.

## Environment Variables

For Gemini AI features:
```bash
set GEMINI_API_KEY=AIzaSyA8dKcom49mGUHTPZSl326gJNRiXvgoQy0
cd backend && python main.py
```

## Testing the Server

After starting the server, test it:
```bash
curl http://localhost:8001/
```

Or use the test script:
```bash
python test_api.py
```
