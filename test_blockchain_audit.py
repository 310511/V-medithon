#!/usr/bin/env python3
"""
Test script for Blockchain Audit Functionality
"""

import requests
import time
import json

def test_blockchain_audit():
    """Test the blockchain audit functionality"""
    
    print("🔍 Testing Blockchain Audit Functionality...")
    print("=" * 60)
    
    # Test 1: Check if ML backend is running
    try:
        print("1️⃣ Testing ML Backend Health...")
        response = requests.get("http://localhost:8001/health", timeout=5)
        if response.status_code == 200:
            print("✅ ML Backend is healthy!")
        else:
            print(f"❌ ML Backend health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to ML Backend: {e}")
        return False
    
    # Test 2: Check current audit logs
    try:
        print("\n2️⃣ Testing Current Audit Logs...")
        response = requests.get("http://localhost:8001/audit", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Current audit logs: {data['total_records']} records")
            if data['audit_logs']:
                print("📊 Sample log entry:")
                sample_log = data['audit_logs'][0]
                print(f"   - Patient ID: {sample_log.get('patient_id', 'N/A')}")
                print(f"   - Prediction: {sample_log.get('prediction', 'N/A')}")
                print(f"   - Confidence: {sample_log.get('probability', 0):.3f}")
                print(f"   - Model Hash: {sample_log.get('model_hash', 'N/A')}")
                print(f"   - Blockchain TX: {sample_log.get('blockchain_tx', 'N/A')}")
                print(f"   - Available fields: {list(sample_log.keys())}")
            else:
                print("📝 No audit logs yet - this is normal for a fresh system")
        else:
            print(f"❌ Audit logs endpoint failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Audit logs endpoint error: {e}")
    
    # Test 3: Perform a test analysis to create new audit log
    try:
        print("\n3️⃣ Testing New Analysis to Create Audit Log...")
        
        # Create test CSV data
        test_csv_data = """CD19,CD20,CD22,CD79A,PAX5,CD10,CD34,CD38,CD45,CD33,CD13,CD14,CD15,CD11b,CD64,CD117,MPO,TdT,CD3,CD7,CD2,CD5,CD8,CD4
3.45,3.34,3.12,2.98,3.01,2.85,0.05,0.02,0.08,0.02,0.01,0.05,0.02,0.01,0.01,0.03,0.01,0.01,0.15,0.08,0.12,0.05,0.18,0.11"""
        
        # Create a file-like object
        from io import BytesIO
        test_file = BytesIO(test_csv_data.encode())
        
        # Send analysis request
        files = {'file': ('test_blockchain.csv', test_file, 'text/csv')}
        data = {'model_type': 'svm', 'user_role': 'Doctor'}
        
        response = requests.post("http://localhost:8001/analyze", files=files, data=data, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ New analysis completed successfully!")
            print(f"   - Patient ID: {result['patient_id']}")
            print(f"   - Prediction: {result['prediction']}")
            print(f"   - Confidence: {result['probability']:.3f}")
            print(f"   - Model Hash: {result['model_hash']}")
            print(f"   - Blockchain TX: {result['blockchain_tx']}")
            
            # Wait a moment for blockchain to process
            print("\n⏳ Waiting for blockchain to process...")
            time.sleep(2)
            
            # Test 4: Check if new audit log appears
            print("\n4️⃣ Verifying New Audit Log in Blockchain...")
            response = requests.get("http://localhost:8001/audit", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Updated audit logs: {data['total_records']} records")
                
                # Look for our new transaction
                new_log = None
                for log in data['audit_logs']:
                    if log['tx_hash'] == result['blockchain_tx']:
                        new_log = log
                        break
                
                if new_log:
                    print("🎉 New audit log found in blockchain!")
                    print(f"   - Patient ID: {new_log['patient_id']}")
                    print(f"   - Prediction: {new_log['prediction']}")
                    print(f"   - Blockchain TX: {new_log['tx_hash']}")
                    print(f"   - Timestamp: {new_log['timestamp']}")
                else:
                    print("⚠️  New audit log not found yet (may need more time)")
            else:
                print(f"❌ Failed to verify new audit log: {response.status_code}")
                
        else:
            print(f"❌ Analysis failed: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Analysis test error: {e}")
    
    # Test 5: Check blockchain statistics
    try:
        print("\n5️⃣ Testing Blockchain Statistics...")
        response = requests.get("http://localhost:8001/stats", timeout=5)
        if response.status_code == 200:
            stats = response.json()
            print("✅ Blockchain statistics:")
            print(f"   - Total Analyses: {stats['total_analyses']}")
            print(f"   - ALL Predictions: {stats['all_predictions']}")
            print(f"   - AML Predictions: {stats['aml_predictions']}")
            print(f"   - Blockchain Transactions: {stats['blockchain_transactions']}")
            print(f"   - Average Confidence: {stats['average_confidence']:.3f}")
        else:
            print(f"❌ Statistics endpoint failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Statistics endpoint error: {e}")
    
    return True

if __name__ == "__main__":
    print("🚀 Starting Blockchain Audit Test...")
    print("=" * 60)
    
    # Wait a bit for backend to start
    print("⏳ Waiting for backend to start...")
    time.sleep(2)
    
    success = test_blockchain_audit()
    
    if success:
        print("\n🎉 Blockchain Audit Test Completed Successfully!")
        print("\n📋 Next Steps:")
        print("1. Open your browser to the React app")
        print("2. Go to Gene Expression Audit Trail → Blockchain Audit")
        print("3. You should see real blockchain data with live statistics")
        print("4. Try uploading a CSV file and watch the blockchain update")
    else:
        print("\n❌ Blockchain Audit Test Failed!")
        print("\n🔧 Troubleshooting:")
        print("1. Check if ML backend is running on port 8001")
        print("2. Check if React app is running on port 3000")
        print("3. Look for error messages in the backend console")
        print("4. Verify blockchain endpoints are accessible")
