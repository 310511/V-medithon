# DoseWise Deployment Guide

This guide explains how to deploy the DoseWise Healthcare AI Platform to Vercel (frontend) and Render (backend services).

## Architecture

- **Frontend**: React + Vite app deployed on Vercel
- **Backend APIs**: 
  - Meal Insulin Prediction API (FastAPI) on Render
  - Infinite Memory API (FastAPI) on Render  
  - Skin Analysis API (Flask) on Render

## Frontend Deployment (Vercel)

### 1. Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set the following environment variables in Vercel dashboard:
   ```
   VITE_MEAL_INSULIN_API_URL=https://dosewise-backend.onrender.com
   VITE_INFINITE_MEMORY_API_URL=https://dosewise-infinite-memory.onrender.com
   VITE_FLASK_API_URL=https://dosewise-flask.onrender.com
   VITE_SPOTIFY_CLIENT_ID=13df0934fc61463789326b9bacea2110
   ```

3. Vercel will automatically build and deploy using the `vercel.json` configuration

### 2. Build Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Backend Deployment (Render)

### 1. Deploy Backend Services

Deploy each service separately on Render:

#### Meal Insulin Prediction API
- **Name**: `dosewise-backend`
- **Environment**: Python 3.11
- **Build Command**: `epip install -r requirements.txt`
- **Start Command**: `python -m uvicorn meal_insulin_prediction_api:app --host 0.0.0.0 --port $PORT`

#### Infinite Memory API
- **Name**: `dosewise-infinite-memory`
- **Environment**: Python 3.11
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python -m uvicorn infinite_memory_api:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `GEMINI_API_KEY`: Your Google Gemini API key

#### Skin Analysis API
- **Name**: `dosewise-flask`
- **Environment**: Python 3.11
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python flask_app.py`

### 2. Environment Variables

Set these in each Render service:
- `PORT`: Automatically set by Render
- `PYTHON_VERSION`: 3.11.0

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- npm or yarn

### Setup

1. **Frontend**:
   ```bash
   cd shine2
   npm install
   npm run dev
   ```

2. **Backend APIs**:
   ```bash
   cd shine2/backend
   pip install -r requirements.txt
   
   # Terminal 1: Meal Insulin API
   python -m uvicorn meal_insulin_prediction_api:app --host 0.0.0.0 --port 8001 --reload
   
   # Terminal 2: Infinite Memory API
   python -m uvicorn infinite_memory_api:app --host 0.0.0.0 --port 8002 --reload
   
   # Terminal 3: Flask API
   python flask_app.py
   ```

## Environment Variables

### Frontend (.env.local)
```
VITE_MEAL_INSULIN_API_URL=http://localhost:8001
VITE_INFINITE_MEMORY_API_URL=http://localhost:8002
VITE_FLASK_API_URL=http://localhost:5000
VITE_SPOTIFY_CLIENT_ID=13df0934fc61463789326b9bacea2110
```

### Backend
- Set `GEMINI_API_KEY` in Render dashboard for Infinite Memory API

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure all backend services have CORS enabled
2. **API Timeouts**: Render free tier has request timeouts - consider upgrading
3. **Build Failures**: Check Python version compatibility (3.11+)
4. **Environment Variables**: Verify all required env vars are set

### Health Checks

- Frontend: `https://your-vercel-app.vercel.app`
- Backend APIs:
  - `https://dosewise-backend.onrender.com/health`
  - `https://dosewise-infinite-memory.onrender.com/`
  - `https://dosewise-flask.onrender.com/`

## Production Considerations

1. **Database**: Consider using Render PostgreSQL for production data
2. **Caching**: Implement Redis for better performance
3. **Monitoring**: Set up logging and monitoring
4. **Security**: Use HTTPS and proper authentication
5. **Scaling**: Upgrade Render plans for better performance

## Support

For deployment issues, check:
- Render service logs
- Vercel build logs
- Browser console for frontend errors
- Network tab for API call failures
