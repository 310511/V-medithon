from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def health_check():
    return jsonify({"status": "healthy", "service": "skin-analysis-api"})

@app.route('/api/skin-analysis', methods=['POST'])
def skin_analysis():
    """Mock skin analysis endpoint for deployment"""
    try:
        # Get form data
        skin_type = request.form.get('skin_type', 'III')
        body_part = request.form.get('body_part', 'other')
        has_evolved = request.form.get('has_evolved', 'false').lower() == 'true'
        evolution_weeks = int(request.form.get('evolution_weeks', '0'))
        
        # Mock analysis result
        result = {
            "prediction": "Benign",
            "confidence": 85.5,
            "risk_level": "Low",
            "analysis_type": "mock_analysis",
            "recommendations": [
                "Continue regular skin monitoring",
                "Use sunscreen with SPF 30+",
                "Schedule annual dermatologist visit"
            ],
            "details": {
                "skin_type": skin_type,
                "body_part": body_part,
                "has_evolved": has_evolved,
                "evolution_weeks": evolution_weeks
            }
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/enhanced-skin-analysis', methods=['POST'])
def enhanced_skin_analysis():
    """Mock enhanced skin analysis endpoint"""
    return skin_analysis()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
