# MedChain Backend Server Activation Guide

This guide will help you activate all backend servers in the MedChain ecosystem.

## 🚀 Quick Start Options

### Option 1: Python Script (Recommended)
```bash
python start_all_backends.py
```

### Option 2: Windows Batch Script
```bash
start_backends.bat
```

### Option 3: Unix/Linux Shell Script
```bash
chmod +x start_backends.sh
./start_backends.sh
```

### Option 4: Docker Compose (Advanced)
```bash
docker-compose -f docker-compose-all-backends.yml up -d
```

## 📋 Backend Servers Overview

| Server | Port | Description | API Docs |
|--------|------|-------------|----------|
| CodeZilla Spider Backend | 8000 | Main backend with infinite memory, medicine recommendation, and inventory management | http://localhost:8000/docs |
| MedHive Backend | 8001 | MedHive API with federated learning and ML models | http://localhost:8001/docs |
| MedHive Agent Backend | 8002 | AI Database Agent with Supabase integration | http://localhost:8002/docs |
| MedHive FL Server | 8082 | Federated Learning Server | http://localhost:8082/docs |
| Symptom Analysis Backend | 7860 | Symptom Analysis Chatbot | http://localhost:7860/docs |
| Pneumonia X-Ray Backend | 7861 | Pneumonia X-Ray Analysis Model | http://localhost:7861/docs |
| Breast Cancer Backend | 7862 | Breast Cancer Detection Model | http://localhost:7862/docs |
| Flask Integration Server | 5000 | Flask integration server for legacy components | http://localhost:5000 |

## 🔧 Prerequisites

### Required Software
- Python 3.8 or higher
- pip (Python package manager)
- Git (for cloning the repository)

### Optional Software
- Docker and Docker Compose (for containerized deployment)
- Node.js (for some frontend components)

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# API Keys
GROQ_API_KEY=your_groq_api_key_here
HUGGINGFACE_TOKEN=your_huggingface_token_here

# Database Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here

# Astra DB Configuration (for MedHive)
ASTRA_DB_ID=your_astra_db_id_here
ASTRA_DB_REGION=your_astra_db_region_here
ASTRA_DB_APPLICATION_TOKEN=your_astra_db_token_here
```

## 📦 Manual Installation

If you prefer to start servers individually, follow these steps:

### 1. CodeZilla Spider Backend
```bash
cd codezilla_spider/backend
pip install -r requirements.txt
python main.py
```

### 2. MedHive Backend
```bash
cd MedHive/backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### 3. MedHive Agent Backend
```bash
cd MedHive-Agent/backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8002 --reload
```

### 4. MedHive FL Server
```bash
cd MedHive-FLServer/server
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8082 --reload
```

### 5. Symptom Analysis Backend
```bash
cd MedHive-ModelHive/SymptomAnalysis/app
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 7860 --reload
```

### 6. Pneumonia X-Ray Backend
```bash
cd MedHive-ModelHive/PneumoniaXRay/backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 7861 --reload
```

### 7. Breast Cancer Backend
```bash
cd MedHive-ModelHive/BreastCancer/app
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 7862 --reload
```

### 8. Flask Integration Server
```bash
cd codezilla_spider/backend
pip install -r flask_requirements.txt
python flask_integration.py
```

## 🛑 Stopping Servers

### Using Scripts
- **Windows**: Close the command prompt windows or use Task Manager
- **Unix/Linux**: Run `./stop_backends.sh`
- **Python Script**: Press `Ctrl+C` in the terminal

### Manual Stop
```bash
# Find and kill processes by port
lsof -ti:8000 | xargs kill -9  # CodeZilla Spider
lsof -ti:8001 | xargs kill -9  # MedHive
lsof -ti:8002 | xargs kill -9  # MedHive Agent
lsof -ti:8082 | xargs kill -9  # FL Server
lsof -ti:7860 | xargs kill -9  # Symptom Analysis
lsof -ti:7861 | xargs kill -9  # Pneumonia X-Ray
lsof -ti:7862 | xargs kill -9  # Breast Cancer
lsof -ti:5000 | xargs kill -9  # Flask Integration
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :8000
   # Kill the process
   kill -9 <PID>
   ```

2. **Missing Dependencies**
   ```bash
   # Install all requirements
   pip install -r requirements.txt
   ```

3. **Permission Denied (Unix/Linux)**
   ```bash
   # Make scripts executable
   chmod +x start_backends.sh stop_backends.sh
   ```

4. **Environment Variables Not Set**
   - Ensure `.env` file exists in the root directory
   - Check that all required variables are set

### Log Files
- **Windows**: Check individual command prompt windows
- **Unix/Linux**: Logs are saved in `/tmp/` directory
- **Python Script**: Output is displayed in the terminal

### Health Checks
Test if servers are running by visiting their health endpoints:
- http://localhost:8000/health (CodeZilla Spider)
- http://localhost:8001/health (MedHive)
- http://localhost:8002/health (MedHive Agent)
- http://localhost:8082/health (FL Server)

## 🐳 Docker Deployment

For production deployment, use Docker Compose:

```bash
# Build and start all services
docker-compose -f docker-compose-all-backends.yml up -d

# View logs
docker-compose -f docker-compose-all-backends.yml logs -f

# Stop all services
docker-compose -f docker-compose-all-backends.yml down
```

## 📊 Monitoring

### Server Status Dashboard
Create a simple monitoring dashboard by visiting:
- http://localhost:8000/docs (CodeZilla Spider API docs)
- http://localhost:8001/docs (MedHive API docs)
- http://localhost:8002/docs (MedHive Agent API docs)

### Health Monitoring
All servers include health check endpoints that return JSON status information.

## 🔐 Security Notes

1. **Environment Variables**: Never commit API keys to version control
2. **Port Security**: In production, use reverse proxies and firewalls
3. **Database Security**: Use strong passwords and encrypted connections
4. **CORS**: Configure CORS properly for production environments

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the log files for error messages
3. Ensure all prerequisites are met
4. Verify environment variables are correctly set

## 🎯 Next Steps

After starting all backend servers:
1. Start the frontend applications
2. Configure database connections
3. Set up monitoring and logging
4. Test API endpoints
5. Deploy to production environment

