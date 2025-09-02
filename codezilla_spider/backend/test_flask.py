#!/usr/bin/env python3
"""
Simple test Flask server to verify basic setup
"""

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Flask server is running',
        'port': 5001
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
    print("🚀 Starting test Flask server on port 5001...")
    print("📊 Health check: http://localhost:5001/health")
    print("🌐 Skin analysis: http://localhost:5001/api/skin-analysis")
    
    app.run(host='0.0.0.0', port=5001, debug=True)
