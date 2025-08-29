# 🚀 SHINE2 Medical Platform - Deployment Guide

This guide covers deploying the SHINE2 Medical Platform on both **Render** and **Vercel**.

## 📋 Project Structure

```
shine2/
├── src/                    # Frontend React components
├── backend/               # FastAPI Python backend
├── render.yaml            # Render frontend config
├── render-backend.yaml    # Render backend config
├── vercel.json            # Vercel frontend config
└── package.json           # Frontend dependencies
```

## 🌐 Platform 1: Render Deployment

### Frontend Deployment (Static Site)

1. **Connect Repository to Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select the `shine2` repository

2. **Configure Build Settings**
   - **Name**: `shine2-medical-frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
   - **Environment**: `Static Site`

3. **Environment Variables**
   ```bash
   NODE_VERSION=18
   VITE_API_URL=https://shine2-medical-backend.onrender.com
   VITE_APP_NAME=SHINE2 Medical Platform
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Render will automatically build and deploy

### Backend Deployment (Web Service)

1. **Create Backend Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend Settings**
   - **Name**: `shine2-medical-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables**
   ```bash
   PYTHON_VERSION=3.11
   PORT=8000
   CORS_ORIGINS=https://shine2-medical-frontend.onrender.com,https://shine2-medical-frontend.vercel.app
   DATABASE_URL=sqlite:///./backend/database/medical.db
   OPENAI_API_KEY=your-openai-api-key-here
   RAZORPAY_KEY_ID=your-razorpay-key-id-here
   RAZORPAY_KEY_SECRET=your-razorpay-secret-here
   ```

4. **Deploy Backend**
   - Click "Create Web Service"
   - Wait for build completion

## ⚡ Platform 2: Vercel Deployment

### Frontend Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Frontend**
   ```bash
   cd shine2
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     ```bash
     VITE_API_URL=https://shine2-medical-backend.onrender.com
     VITE_APP_NAME=SHINE2 Medical Platform
     ```

5. **Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add your custom domain

## 🔧 Configuration Files

### render.yaml (Frontend)
```yaml
services:
  - type: web
    name: shine2-medical-frontend
    env: static
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
```

### render-backend.yaml (Backend)
```yaml
services:
  - type: web
    name: shine2-medical-backend
    env: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### vercel.json (Frontend)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{"source": "/(.*)", "destination": "/index.html"}]
}
```

## 🌍 Environment Variables Setup

### Frontend (.env.local)
```bash
VITE_API_URL=https://shine2-medical-backend.onrender.com
VITE_APP_NAME=SHINE2 Medical Platform
```

### Backend (.env)
```bash
CORS_ORIGINS=https://shine2-medical-frontend.onrender.com,https://shine2-medical-frontend.vercel.app
DATABASE_URL=sqlite:///./backend/database/medical.db
OPENAI_API_KEY=your-actual-openai-key
RAZORPAY_KEY_ID=your-actual-razorpay-key
RAZORPAY_KEY_SECRET=your-actual-razorpay-secret
```

## 🚀 Quick Deploy Commands

### Render (Using render.yaml)
```bash
# Frontend will auto-deploy from render.yaml
# Backend needs manual setup using render-backend.yaml
```

### Vercel
```bash
cd shine2
vercel --prod
```

## 🔍 Health Checks

### Backend Health Endpoint
```bash
GET https://shine2-medical-backend.onrender.com/health
```

### Frontend Status
- Check Render/Vercel dashboard for deployment status
- Monitor build logs for any errors

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (use 18+)
   - Verify all dependencies in package.json
   - Check build logs for specific errors

2. **CORS Issues**
   - Ensure CORS_ORIGINS includes your frontend URLs
   - Check backend CORS middleware configuration

3. **Environment Variables**
   - Verify all required env vars are set
   - Check for typos in variable names
   - Ensure sensitive keys are properly secured

4. **Database Issues**
   - Verify DATABASE_URL format
   - Check if database file exists and is accessible
   - Ensure proper permissions

### Debug Commands

```bash
# Check build locally
npm run build

# Test backend locally
cd backend
uvicorn main:app --reload

# Check environment
echo $VITE_API_URL
echo $NODE_VERSION
```

## 📊 Monitoring & Maintenance

### Render Dashboard
- Monitor service health
- Check build logs
- View environment variables
- Monitor resource usage

### Vercel Dashboard
- View deployment history
- Monitor performance metrics
- Check function logs
- Manage domains

## 🔐 Security Considerations

1. **Environment Variables**
   - Never commit sensitive keys to git
   - Use platform-specific secret management
   - Rotate keys regularly

2. **CORS Configuration**
   - Restrict origins to trusted domains
   - Avoid using `*` in production

3. **API Security**
   - Implement rate limiting
   - Add authentication middleware
   - Validate all inputs

## 📈 Performance Optimization

1. **Frontend**
   - Enable asset compression
   - Use CDN for static assets
   - Implement lazy loading

2. **Backend**
   - Add caching layers
   - Optimize database queries
   - Use connection pooling

## 🎯 Next Steps

1. **Deploy Backend First**
   - Use render-backend.yaml
   - Verify health endpoint works

2. **Deploy Frontend**
   - Use render.yaml for Render
   - Use vercel.json for Vercel

3. **Test Integration**
   - Verify API calls work
   - Check CORS configuration
   - Test all major features

4. **Monitor & Optimize**
   - Set up monitoring
   - Optimize performance
   - Plan scaling strategy

---

**Need Help?** Check the logs in your deployment platform dashboard or refer to the troubleshooting section above. 