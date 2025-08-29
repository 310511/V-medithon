#!/bin/bash

# 🚀 SHINE2 Medical Platform - Deployment Script
# This script helps deploy to both Render and Vercel

set -e

echo "🚀 SHINE2 Medical Platform Deployment Script"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "All requirements are met!"
}

# Build the frontend
build_frontend() {
    print_status "Building frontend..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    npm ci
    npm run build
    
    if [ -d "dist" ]; then
        print_success "Frontend built successfully!"
    else
        print_error "Frontend build failed. Check the build logs."
        exit 1
    fi
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    print_status "Please login to Vercel if prompted..."
    vercel --prod
    
    print_success "Vercel deployment completed!"
}

# Check backend health
check_backend_health() {
    print_status "Checking backend health..."
    
    # This would need to be updated with the actual backend URL
    BACKEND_URL="https://shine2-medical-backend.onrender.com"
    
    if command -v curl &> /dev/null; then
        if curl -s "$BACKEND_URL/health" > /dev/null; then
            print_success "Backend is healthy!"
        else
            print_warning "Backend health check failed. Make sure it's deployed."
        fi
    else
        print_warning "curl not found. Cannot check backend health."
    fi
}

# Main deployment flow
main() {
    echo ""
    print_status "Starting deployment process..."
    
    # Check requirements
    check_requirements
    
    # Build frontend
    build_frontend
    
    # Deploy to Vercel
    deploy_vercel
    
    # Check backend health
    check_backend_health
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set up backend on Render using render-backend.yaml"
    echo "2. Configure environment variables in both platforms"
    echo "3. Test the integration between frontend and backend"
    echo "4. Monitor deployments in both dashboards"
    echo ""
    echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"
}

# Run main function
main "$@"
