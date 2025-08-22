# Firebase Setup Guide for MedChain

## 🔥 **Firebase Installation**

### **Step 1: Install Firebase SDK**
Run this command in your terminal:
```bash
npm install firebase
```

### **Step 2: Firebase Console Setup**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `medchain-11528`
3. **Enable Authentication**:
   - Go to "Authentication" → "Get started"
   - Click "Sign-in method" tab
   - Enable "Google" provider
   - Add authorized domains: `localhost` (for development)

### **Step 3: Authorized Domains**
In Firebase Console → Authentication → Settings → Authorized domains:
- Add: `localhost`
- Add: `127.0.0.1` (if needed)

## 🚀 **What's Already Configured**

✅ **Firebase Config**: Already set up in `src/lib/firebase.ts`
✅ **AuthContext**: Updated to use real Firebase authentication
✅ **Google Provider**: Configured with proper settings
✅ **Error Handling**: Comprehensive error messages for different scenarios

## 🎯 **Features Now Available**

- **Real Google Sign-in**: Uses actual Google OAuth
- **User Persistence**: Users stay logged in across sessions
- **Profile Management**: Save additional profile data locally
- **Error Handling**: Proper error messages for popup blocks, network issues, etc.
- **Security**: Firebase handles all security best practices

## 🔧 **Testing the Implementation**

1. **Install Firebase**: `npm install firebase`
2. **Start the app**: `npm run dev`
3. **Test Google Sign-in**: Click "Continue with Google" on sign-in page
4. **Check Firebase Console**: See users in Authentication → Users

## 🛠 **Troubleshooting**

### **If you get "Pop-up blocked" error**:
- Allow pop-ups for `localhost:3001`
- Try clicking the button again

### **If you get "Network error"**:
- Check your internet connection
- Make sure Firebase project is properly configured

### **If sign-in doesn't work**:
- Check browser console for errors
- Verify Google provider is enabled in Firebase Console
- Ensure `localhost` is in authorized domains

## 📱 **Next Steps**

Once Firebase is installed and working:
1. Test the complete authentication flow
2. Try signing in with different Google accounts
3. Test profile updates and persistence
4. Deploy to production (add production domain to authorized domains)

## 🔐 **Security Notes**

- Firebase handles all security automatically
- User tokens are managed securely
- No sensitive data is stored in localStorage (only additional profile data)
- All authentication is handled by Google/Firebase

---

**Need help?** Check the Firebase documentation or let me know if you encounter any issues!
