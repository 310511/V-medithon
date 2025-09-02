# 🚀 DoseWise Deployment Guide

## Quick Start

### 1. Frontend (Vercel)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/310511/V-medithon)

**Environment Variables to set in Vercel:**
```
VITE_MEAL_INSULIN_API_URL=https://dosewise-backend.onrender.com
VITE_INFINITE_MEMORY_API_URL=https://dosewise-infinite-memory.onrender.com
VITE_FLASK_API_URL=https://dosewise-flask.onrender.com
VITE_SPOTIFY_CLIENT_ID=13df0934fc61463789326b9bacea2110
```

### 2. Backend Services (Render)

Deploy these 3 services separately on Render:

#### Service 1: Meal Insulin API
- **Repository**: `https://github.com/310511/V-medithon`
- **Root Directory**: `shine2/backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python -m uvicorn meal_insulin_prediction_api:app --host 0.0.0.0 --port $PORT`

#### Service 2: Infinite Memory API
- **Repository**: `https://github.com/310511/V-medithon`
- **Root Directory**: `shine2/backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python -m uvicorn infinite_memory_api:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**: `GEMINI_API_KEY=your-gemini-key`

#### Service 3: Flask Skin Analysis API
- **Repository**: `https://github.com/310511/V-medithon`
- **Root Directory**: `shine2/backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python flask_app.py`

## 🛠️ Local Development

```bash
# Frontend
npm install
npm run dev

# Backend (3 terminals)
cd backend
pip install -r requirements.txt

# Terminal 1
python -m uvicorn meal_insulin_prediction_api:app --port 8001 --reload

# Terminal 2  
python -m uvicorn infinite_memory_api:app --port 8002 --reload

# Terminal 3
python flask_app.py
```

## 📋 Features

- ✅ **Meal Insulin Prediction** - AI-powered insulin dosage calculation
- ✅ **Phone Bluetooth Glucose Monitoring** - Real-time glucose tracking
- ✅ **AI Skin Analysis** - Dermatological image analysis
- ✅ **Infinite Memory** - AI-powered conversation memory
- ✅ **Spotify Integration** - Music therapy for wellness
- ✅ **Marketplace** - Medical supplies marketplace
- ✅ **Blockchain Medical Records** - Secure health data storage

## 🔧 Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Flask + Python
- **AI**: Google Gemini API + Scikit-learn
- **Database**: SQLite
- **Deployment**: Vercel + Render

## 📞 Support

For deployment issues, check the logs in:
- Vercel dashboard (frontend)
- Render dashboard (backend services)
- Browser console (frontend errors)
