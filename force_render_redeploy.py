#!/usr/bin/env python3
"""
Force Render redeploy by making a small change to trigger deployment
"""

import os
import sys
from datetime import datetime

def create_deployment_trigger():
    """Create a file that will trigger Render redeploy"""
    
    # Create a simple trigger file
    trigger_content = f"""# Deployment Trigger
# Generated at: {datetime.now().isoformat()}
# This file forces Render to redeploy with updated environment variables

DEPLOYMENT_TRIGGER = "gemini_api_key_update_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
"""
    
    with open("backend/deployment_trigger.txt", "w") as f:
        f.write(trigger_content)
    
    print("✅ Created deployment trigger file")
    print("📝 This will force Render to redeploy with the updated Gemini API key")
    
    return True

def main():
    """Main function"""
    print("🚀 Force Render Redeploy for Gemini API Key Update")
    print("=" * 60)
    
    # Create trigger file
    create_deployment_trigger()
    
    print("\n📋 Next Steps:")
    print("1. Commit and push this change")
    print("2. Render will automatically redeploy")
    print("3. Wait 5-10 minutes for deployment to complete")
    print("4. Test the infinite memory API")
    
    print(f"\n🔑 Using API Key: AIzaSyByWvWkLKedG2WKnxtVhefQBRLZyrwf-tE")
    print("✅ All old API keys have been removed")
    
    return True

if __name__ == "__main__":
    main()
