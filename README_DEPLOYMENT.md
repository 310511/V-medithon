# 🚀 Quick Deployment Guide

## ⚡ One-Click Deploy

### Frontend (Vercel)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Punyamittal/shine2&project-name=shine2-medical&framework=vite)

### Backend (Render)
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Use `render-backend.yaml` configuration

## 🎯 Quick Start

### 1. Deploy Backend First
```bash
# Use render-backend.yaml in Render dashboard
# Or manually configure:
# - Environment: Python 3
# - Build: pip install -r backend/requirements.txt
# - Start: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 2. Deploy Frontend
```bash
# Option A: Use deployment script
./deploy.sh

# Option B: Manual Vercel deployment
npm install -g vercel
vercel --prod
```

### 3. Configure Environment Variables
```bash
# Frontend (.env.local)
VITE_API_URL=https://your-backend-url.onrender.com
VITE_APP_NAME=SHINE2 Medical Platform

# Backend (in Render dashboard)
CORS_ORIGINS=https://your-frontend-url.vercel.app
OPENAI_API_KEY=your-key
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
```

## 🔗 URLs After Deployment

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-project.onrender.com`
- **Health Check**: `https://your-backend.onrender.com/health`

## 📚 Full Documentation

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions.

## 🆘 Need Help?

1. Check deployment logs in platform dashboards
2. Verify environment variables are set correctly
3. Ensure backend is running before testing frontend
4. Check CORS configuration if API calls fail
