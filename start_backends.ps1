# MedChain Backend Server Startup Script for PowerShell
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   MedChain Backend Server Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Starting all backend servers..." -ForegroundColor Yellow
Write-Host ""

# Function to start a server
function Start-Server {
    param(
        [string]$Name,
        [string]$Directory,
        [string]$Command,
        [string]$Port
    )
    
    Write-Host "[$Port] Starting $Name..." -ForegroundColor Yellow
    
    # Check if directory exists
    if (-not (Test-Path $Directory)) {
        Write-Host "⚠️  Directory not found: $Directory" -ForegroundColor Yellow
        return
    }
    
    # Check if requirements.txt exists and install dependencies
    $requirementsFile = Join-Path $Directory "requirements.txt"
    if (Test-Path $requirementsFile) {
        Write-Host "📦 Installing dependencies for $Name..." -ForegroundColor Blue
        try {
            Set-Location $Directory
            pip install -r requirements.txt | Out-Null
            Write-Host "✅ Dependencies installed for $Name" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to install dependencies for $Name" -ForegroundColor Red
            return
        }
    }
    
    # Start the server in a new window
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = "cmd.exe"
    $startInfo.Arguments = "/k `"cd /d $Directory && $Command`""
    $startInfo.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Normal
    
    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $startInfo
    $process.Start() | Out-Null
    
    Write-Host "✅ $Name started successfully" -ForegroundColor Green
    Start-Sleep -Seconds 2
}

# Start all servers
Start-Server -Name "CodeZilla Spider Backend" -Directory "codezilla_spider\backend" -Command "python main.py" -Port "8000"
Start-Server -Name "MedHive Backend" -Directory "MedHive\backend" -Command "uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload" -Port "8001"
Start-Server -Name "MedHive Agent Backend" -Directory "MedHive-Agent\backend" -Command "uvicorn main:app --host 0.0.0.0 --port 8002 --reload" -Port "8002"
Start-Server -Name "MedHive FL Server" -Directory "MedHive-FLServer\server" -Command "uvicorn app:app --host 0.0.0.0 --port 8082 --reload" -Port "8082"
Start-Server -Name "Symptom Analysis Backend" -Directory "MedHive-ModelHive\SymptomAnalysis\app" -Command "uvicorn main:app --host 0.0.0.0 --port 7860 --reload" -Port "7860"
Start-Server -Name "Pneumonia X-Ray Backend" -Directory "MedHive-ModelHive\PneumoniaXRay\backend" -Command "uvicorn main:app --host 0.0.0.0 --port 7861 --reload" -Port "7861"
Start-Server -Name "Breast Cancer Backend" -Directory "MedHive-ModelHive\BreastCancer\app" -Command "uvicorn main:app --host 0.0.0.0 --port 7862 --reload" -Port "7862"
Start-Server -Name "Flask Integration Server" -Directory "codezilla_spider\backend" -Command "python flask_integration.py" -Port "5000"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    All Backend Servers Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API Endpoints:" -ForegroundColor White
Write-Host "- CodeZilla Spider: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "- MedHive: http://localhost:8001/docs" -ForegroundColor Cyan
Write-Host "- MedHive Agent: http://localhost:8002/docs" -ForegroundColor Cyan
Write-Host "- FL Server: http://localhost:8082/docs" -ForegroundColor Cyan
Write-Host "- Symptom Analysis: http://localhost:7860/docs" -ForegroundColor Cyan
Write-Host "- Pneumonia X-Ray: http://localhost:7861/docs" -ForegroundColor Cyan
Write-Host "- Breast Cancer: http://localhost:7862/docs" -ForegroundColor Cyan
Write-Host "- Flask Integration: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Each server is running in its own command prompt window." -ForegroundColor Yellow
Write-Host "Close the windows to stop individual servers." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to close this window"


