#!/bin/bash

echo "========================================"
echo "   MedChain Backend Server Shutdown"
echo "========================================"
echo

echo "🛑 Stopping all backend servers..."

# Kill all background processes
for pid_file in /tmp/*.pid; do
    if [ -f "$pid_file" ]; then
        pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo "Stopping process $pid..."
            kill "$pid"
            sleep 1
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                echo "Force killing process $pid..."
                kill -9 "$pid"
            fi
        fi
        rm "$pid_file"
    fi
done

# Also kill any remaining Python processes that might be our servers
echo "Cleaning up any remaining Python processes..."
pkill -f "uvicorn.*--port" 2>/dev/null || true
pkill -f "python.*main.py" 2>/dev/null || true
pkill -f "python.*flask_integration.py" 2>/dev/null || true

echo "✅ All servers stopped successfully"
echo
echo "Log files are still available in /tmp/ if you need to check them"

