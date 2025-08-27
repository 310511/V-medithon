#!/bin/bash

echo "========================================"
echo "   MedChain Backend Server Startup"
echo "========================================"
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 is not installed or not in PATH"
    exit 1
fi

echo "Starting all backend servers..."
echo

# Function to start a server in background
start_server() {
    local name="$1"
    local dir="$2"
    local command="$3"
    local port="$4"
    
    echo "[$port] Starting $name..."
    
    # Check if directory exists
    if [ ! -d "$dir" ]; then
        echo "⚠️  Directory not found: $dir"
        return 1
    fi
    
    # Install dependencies if requirements.txt exists
    if [ -f "$dir/requirements.txt" ]; then
        echo "📦 Installing dependencies for $name..."
        pip install -r "$dir/requirements.txt" > /dev/null 2>&1
    fi
    
    # Start server in background
    cd "$dir" && $command > "/tmp/${name// /_}.log" 2>&1 &
    local pid=$!
    echo "✅ $name started with PID: $pid"
    echo $pid > "/tmp/${name// /_}.pid"
}

# Start all servers
start_server "CodeZilla Spider Backend" "codezilla_spider/backend" "python main.py" "8000"
sleep 2

start_server "MedHive Backend" "MedHive/backend" "uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload" "8001"
sleep 2

start_server "MedHive Agent Backend" "MedHive-Agent/backend" "uvicorn main:app --host 0.0.0.0 --port 8002 --reload" "8002"
sleep 2

start_server "MedHive FL Server" "MedHive-FLServer/server" "uvicorn app:app --host 0.0.0.0 --port 8082 --reload" "8082"
sleep 2

start_server "Symptom Analysis Backend" "MedHive-ModelHive/SymptomAnalysis/app" "uvicorn main:app --host 0.0.0.0 --port 7860 --reload" "7860"
sleep 2

start_server "Pneumonia X-Ray Backend" "MedHive-ModelHive/PneumoniaXRay/backend" "uvicorn main:app --host 0.0.0.0 --port 7861 --reload" "7861"
sleep 2

start_server "Breast Cancer Backend" "MedHive-ModelHive/BreastCancer/app" "uvicorn main:app --host 0.0.0.0 --port 7862 --reload" "7862"
sleep 2

start_server "Flask Integration Server" "codezilla_spider/backend" "python flask_integration.py" "5000"
sleep 2

echo
echo "========================================"
echo "    All Backend Servers Started!"
echo "========================================"
echo
echo "API Endpoints:"
echo "- CodeZilla Spider: http://localhost:8000/docs"
echo "- MedHive: http://localhost:8001/docs"
echo "- MedHive Agent: http://localhost:8002/docs"
echo "- FL Server: http://localhost:8082/docs"
echo "- Symptom Analysis: http://localhost:7860/docs"
echo "- Pneumonia X-Ray: http://localhost:7861/docs"
echo "- Breast Cancer: http://localhost:7862/docs"
echo "- Flask Integration: http://localhost:5000"
echo
echo "Log files are saved in /tmp/"
echo "To stop all servers, run: ./stop_backends.sh"
echo
echo "Press Ctrl+C to stop all servers..."
echo

# Function to cleanup on exit
cleanup() {
    echo
    echo "🛑 Shutting down all servers..."
    
    # Kill all background processes
    for pid_file in /tmp/*.pid; do
        if [ -f "$pid_file" ]; then
            pid=$(cat "$pid_file")
            if kill -0 "$pid" 2>/dev/null; then
                echo "Stopping process $pid..."
                kill "$pid"
            fi
            rm "$pid_file"
        fi
    done
    
    echo "✅ All servers stopped successfully"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
while true; do
    sleep 1
done


