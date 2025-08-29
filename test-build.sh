#!/bin/bash

# 🧪 Test Build Script for SHINE2 Medical Platform
# This script tests if the local build process works correctly

set -e

echo "🧪 Testing SHINE2 Medical Platform Build Process"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_warning "Node.js version $(node --version) detected. Version 18+ is recommended."
fi

print_success "Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm $(npm --version) detected"

# Clean previous build
echo "🧹 Cleaning previous build..."
if [ -d "dist" ]; then
    rm -rf dist
    print_success "Previous dist folder removed"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci
print_success "Dependencies installed successfully"

# Run build
echo "🔨 Building application..."
npm run build
print_success "Build completed successfully"

# Check if dist folder was created
if [ -d "dist" ]; then
    print_success "dist folder created successfully"
    echo "📁 Build output contents:"
    ls -la dist/
    
    # Check for key files
    if [ -f "dist/index.html" ]; then
        print_success "index.html found in dist folder"
    else
        print_error "index.html not found in dist folder"
    fi
    
    if [ -d "dist/assets" ]; then
        print_success "assets folder found in dist folder"
        echo "📁 Assets contents:"
        ls -la dist/assets/ | head -5
    else
        print_warning "assets folder not found in dist folder"
    fi
else
    print_error "dist folder was not created"
    exit 1
fi

# Test preview (optional)
echo "🚀 Testing preview server..."
echo "Starting preview server on http://localhost:4173"
echo "Press Ctrl+C to stop the preview server"
echo ""

# Start preview server in background
npm run preview &
PREVIEW_PID=$!

# Wait a moment for server to start
sleep 3

# Check if server is running
if kill -0 $PREVIEW_PID 2>/dev/null; then
    print_success "Preview server started successfully"
    echo "✅ Local build test PASSED!"
    echo "🌐 Your app should be available at: http://localhost:4173"
    echo ""
    echo "To stop the preview server, run: kill $PREVIEW_PID"
else
    print_error "Preview server failed to start"
    echo "❌ Local build test FAILED!"
    exit 1
fi
