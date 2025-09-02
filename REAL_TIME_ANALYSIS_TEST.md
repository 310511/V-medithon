# 🧬 Real-Time ML Analysis Test Guide

## 🎯 **What's Working Now:**

✅ **ML Backend**: Running on port 8001 with trained models
✅ **React App**: Running on port 3000
✅ **Real ML Models**: SVM, Random Forest, and MLP loaded
✅ **API Endpoints**: All working and tested

## 🧪 **How to Test Real-Time Analysis:**

### **Step 1: Access the Application**
1. **Open browser** and go to: `http://localhost:3000/`
2. **Navigate to**: DoseWise → Gene Expression Audit Trail
3. **Make sure you're on the "Upload & Preprocess" tab**

### **Step 2: Test with Sample Data**
1. **Click "Upload Sample Data"** button
2. **Watch the console** for detailed logging
3. **Check if it shows real ML results** or falls back to mock

### **Step 3: Test with Real CSV File**
1. **Use the file input** to upload `test_all.csv` (included)
2. **Watch the console** for ML API calls
3. **Look for real results** with actual confidence scores

## 🔍 **Expected Console Output for Real Analysis:**

```
handleGeneExpressionFileUpload called with file: File {name: "test_all.csv", ...}
Processing file: test_all.csv
Sending file to ML backend...
FormData contents: {fileName: "test_all.csv", fileSize: 123, fileType: "text/csv", modelType: "svm", userRole: "Doctor"}
ML API response status: 200 OK
ML API response headers: {...}
ML API response: {patient_id: "P...", prediction: "ALL", probability: 0.588, ...}
Setting real gene expression data: {...}
Real ML analysis completed successfully: {...}
```

## 🔍 **Expected Console Output for Mock Analysis (Fallback):**

```
Failed to process gene expression file: Error: ML API error: ...
Falling back to mock analysis...
Performing mock analysis as fallback...
```

## 📊 **What Real Results Look Like:**

✅ **Real Prediction**: "ALL" or "AML" (not "ALL (Acute Lymphoblastic Leukemia)")
✅ **Real Confidence**: Actual decimal like 0.588 (not 0.87)
✅ **Real Model Hash**: 16-character hex string
✅ **Real Blockchain TX**: 16-character hex string
✅ **Real Top Genes**: Actual importance scores from trained models

## 🚨 **If You Still See Mock Results:**

1. **Check Console**: Look for error messages
2. **Check Network Tab**: See if API calls are failing
3. **Check CORS**: Look for CORS errors
4. **Check File Format**: Ensure CSV has correct structure

## 📁 **Test Files Available:**

- `test_data.csv` - Mixed gene expression data
- `test_all.csv` - Clear ALL leukemia pattern
- Both files have the correct format for the ML backend

## 🎯 **Success Indicators:**

- ✅ Console shows "Real ML analysis completed successfully"
- ✅ Results show actual decimal confidence scores
- ✅ Model hash and blockchain TX are real hex strings
- ✅ Top genes have actual importance scores from models

## 🔧 **Troubleshooting:**

If you still see mock results, the issue is likely:
1. **CSV Format**: Wrong structure for ML backend
2. **CORS Issues**: Browser blocking API calls
3. **Network Errors**: API calls failing silently
4. **File Upload**: Issues with file handling

**Check the console logs** - they will show exactly what's happening!
