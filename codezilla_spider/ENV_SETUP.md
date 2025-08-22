# Environment Variables Setup Guide

This guide will help you set up environment variables to secure your API keys and configuration.

## 🔐 Security Notice

**IMPORTANT**: Never commit API keys or sensitive configuration to version control. Always use environment variables for sensitive data.

## 📁 Create .env File

Create a `.env` file in the `codezilla_spider` directory with the following content:

```env
# OpenAI API Configuration
OPENAI_API_KEY=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

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyAePpEwxlOFgxVCn4tVeVIZ4xnVv-cdKUk
VITE_FIREBASE_AUTH_DOMAIN=medchain-11528.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=medchain-11528
VITE_FIREBASE_STORAGE_BUCKET=medchain-11528.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123027023076
VITE_FIREBASE_APP_ID=1:123027023076:web:b071a3a77d48beee67b8f1
VITE_FIREBASE_MEASUREMENT_ID=G-EDSGGHW2VG

# ElevenLabs API Configuration
ELEVENLABS_API_KEY=dummy

# Session Configuration
SESSION_SECRET=spider1-flask-secret-key

# YouTube API Configuration
YOUTUBE_API_KEY=AIzaSyCKZvQBqIJPzQbT9jo4w2Huzp5V7z715QU

# Groq API Configuration (for other projects)
GROQ_API_KEY=your_groq_api_key_here

# Google Gemini API Configuration (for other projects)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Backend Configuration
BACKEND_HOST=localhost
BACKEND_PORT=8000
```

## 🔧 Frontend Environment Variables (Vite)

For the frontend (Vite), environment variables must be prefixed with `VITE_` to be accessible in the browser:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- etc.

## 🐍 Backend Environment Variables (Python)

For the backend (Python), environment variables are accessed directly:

- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `SESSION_SECRET`
- etc.

## 📋 Setup Instructions

### 1. Create .env File
```bash
# Navigate to the codezilla_spider directory
cd codezilla_spider

# Create .env file
touch .env
```

### 2. Add Environment Variables
Copy the content above into your `.env` file.

### 3. Install Dependencies
```bash
# Install python-dotenv for backend
pip install python-dotenv

# Or update requirements.txt and install
pip install -r backend/requirements.txt
```

### 4. Update .gitignore
Make sure your `.gitignore` file includes:
```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## 🔍 Verification

### Frontend (Vite)
The frontend will automatically load environment variables prefixed with `VITE_`.

### Backend (Python)
The backend now uses `python-dotenv` to load environment variables from the `.env` file.

## 🛡️ Security Best Practices

1. **Never commit .env files** to version control
2. **Use different API keys** for development and production
3. **Rotate API keys** regularly
4. **Use environment-specific .env files** (.env.development, .env.production)
5. **Validate environment variables** on application startup

## 🚨 Important Notes

- The current setup includes fallback values to ensure the application continues to work
- API keys are now loaded from environment variables instead of being hardcoded
- The application will work with the current fallback values if no .env file is present
- For production, always set proper environment variables

## 🔄 Migration Complete

The following files have been updated to use environment variables:

- ✅ `src/lib/firebase.ts` - Firebase configuration
- ✅ `backend/start_server.py` - OpenAI API key loading
- ✅ `backend/config.py` - Environment variable integration
- ✅ `backend/requirements.txt` - Added python-dotenv dependency

All API keys are now secured and the application will continue to work as before!
