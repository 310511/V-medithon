#!/usr/bin/env python3
"""
Simple test server to verify Flask works
"""

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Test Flask server is running',
        'port': 5002
    })

@app.route('/api/skin-analysis', methods=['POST'])
def test_skin_analysis():
    return jsonify({
        'success': True,
        'message': 'Skin analysis endpoint is working',
        'prediction': 'Test prediction: Benign',
        'confidence': 85
    })

if __name__ == '__main__':
    print("🚀 Starting test Flask server on port 5002...")
    print("📊 Health check: http://localhost:5002/health")
    print("🌐 Skin analysis: http://localhost:5002/api/skin-analysis")
    
    try:
        app.run(host='127.0.0.1', port=5002, debug=False)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
