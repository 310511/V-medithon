#!/bin/bash

# DoseWise Deployment Script

echo "🚀 Starting DoseWise deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the shine2 directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Frontend is ready for deployment to Vercel"
    echo "📋 Backend services are ready for deployment to Render"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed deployment instructions"
    echo ""
    echo "🔗 Quick deployment links:"
    echo "   Frontend: https://vercel.com/new"
    echo "   Backend: https://render.com/dashboard"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi