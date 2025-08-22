@echo off
echo ========================================
echo    MedChain Backend Server Startup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

echo Starting all backend servers...
echo.

REM Start CodeZilla Spider Backend
echo [1/8] Starting CodeZilla Spider Backend (Port 8000)...
start "CodeZilla Spider Backend" cmd /k "cd codezilla_spider\backend && python main.py"

REM Start MedHive Backend
echo [2/8] Starting MedHive Backend (Port 8001)...
start "MedHive Backend" cmd /k "cd MedHive\backend && uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"

REM Start MedHive Agent Backend
echo [3/8] Starting MedHive Agent Backend (Port 8002)...
start "MedHive Agent Backend" cmd /k "cd MedHive-Agent\backend && uvicorn main:app --host 0.0.0.0 --port 8002 --reload"

REM Start MedHive FL Server
echo [4/8] Starting MedHive FL Server (Port 8082)...
start "MedHive FL Server" cmd /k "cd MedHive-FLServer\server && uvicorn app:app --host 0.0.0.0 --port 8082 --reload"

REM Start Symptom Analysis Backend
echo [5/8] Starting Symptom Analysis Backend (Port 7860)...
start "Symptom Analysis Backend" cmd /k "cd MedHive-ModelHive\SymptomAnalysis\app && uvicorn main:app --host 0.0.0.0 --port 7860 --reload"

REM Start Pneumonia X-Ray Backend
echo [6/8] Starting Pneumonia X-Ray Backend (Port 7861)...
start "Pneumonia X-Ray Backend" cmd /k "cd MedHive-ModelHive\PneumoniaXRay\backend && uvicorn main:app --host 0.0.0.0 --port 7861 --reload"

REM Start Breast Cancer Backend
echo [7/8] Starting Breast Cancer Backend (Port 7862)...
start "Breast Cancer Backend" cmd /k "cd MedHive-ModelHive\BreastCancer\app && uvicorn main:app --host 0.0.0.0 --port 7862 --reload"

REM Start Flask Integration Server
echo [8/8] Starting Flask Integration Server (Port 5000)...
start "Flask Integration Server" cmd /k "cd codezilla_spider\backend && python flask_integration.py"

echo.
echo ========================================
echo    All Backend Servers Started!
echo ========================================
echo.
echo API Endpoints:
echo - CodeZilla Spider: http://localhost:8000/docs
echo - MedHive: http://localhost:8001/docs
echo - MedHive Agent: http://localhost:8002/docs
echo - FL Server: http://localhost:8082/docs
echo - Symptom Analysis: http://localhost:7860/docs
echo - Pneumonia X-Ray: http://localhost:7861/docs
echo - Breast Cancer: http://localhost:7862/docs
echo - Flask Integration: http://localhost:5000
echo.
echo Press any key to close this window...
pause >nul


