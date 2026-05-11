# Firebase Phone Authentication - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Firebase Project Setup
```bash
# Go to: https://console.firebase.google.com
# Create new project → "QuickCart" → Continue

# In Firebase Console:
# 1. Go to: Authentication → Sign-in method
# 2. Click: Phone
# 3. Toggle: ON
# 4. Click: Save
```

### 2. Get Firebase Credentials
```bash
# In Firebase Console:
# 1. Click: Project Settings (gear icon)
# 2. Under "Your apps", find Web app
# 3. Copy the config object:
{
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

### 3. Get reCAPTCHA Site Key
```bash
# In Firebase Console:
# 1. Go to: Project Settings → reCAPTCHA keys
# 2. If no keys shown, create one:
#    - Go: Google Cloud Console (link in Firebase)
#    - Navigate: Security → reCAPTCHA Admin
#    - Create: reCAPTCHA v3 (Invisible)
#    - Domains: localhost:5173, yourdomain.com
# 3. Copy: Site Key
```

### 4. Update .env File
```bash
# Edit: /QuickCart/.env

VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_RECAPTCHA_SITE_KEY=YOUR_RECAPTCHA_SITE_KEY
VITE_API_BASE_URL=http://localhost:5000/api
```

### 5. Install Dependencies
```bash
cd QuickCart
npm install
# Firebase is already installed from previous setup
```

### 6. Run Development Server
```bash
npm run dev
# Should open: http://localhost:5173
```

### 7. Test Login
```bash
# In browser console (F12), you should see:
# ✅ Firebase initialized successfully
# ✅ reCAPTCHA initialized successfully

# Go to: http://localhost:5173/login

# Use Firebase test phone number:
# +1 (555) 012-3456
# (or any test number in Firebase Console settings)

# Use any 6-digit code for OTP (e.g., 123456)

# Should redirect to home page after verification
```

## 📱 Using the App

### For Testing (Development)
1. Go to Firebase Console → Authentication → Settings
2. Add Test Phone Number (e.g., +1 (555) 012-3456)
3. Use any 6-digit code for OTP verification
4. No actual SMS sent for test numbers

### For Production (Real Phone Numbers)
1. Requires real phone number with valid country code
2. Firebase sends actual SMS to phone
3. User must enter correct OTP received on phone
4. After 6 attempts or 10 minutes, OTP expires

## 🔧 Key Files & Their Functions

| File | Purpose |
|------|---------|
| `src/config/firebase.js` | Firebase initialization |
| `src/utils/firebaseAuth.js` | OTP functions |
| `src/utils/recaptchaWidget.js` | reCAPTCHA management |
| `src/pages/Login.jsx` | Login UI |
| `src/api/services/authService.js` | Authentication API |
| `src/queries/authQueries.js` | React Query hooks |
| `src/store/slices/authSlice.js` | Redux state |
| `src/hooks/useInitializeAuth.js` | Auth state sync |

## 🧪 Testing Checklist

- [ ] Run `npm run dev`
- [ ] See "✅ Firebase initialized" in console
- [ ] Navigate to /login
- [ ] Enter test phone number
- [ ] Click "Get Verification Code"
- [ ] See OTP input screen
- [ ] Enter 6-digit OTP
- [ ] Click "Verify & Continue"
- [ ] Redirected to home page
- [ ] Go to /profile
- [ ] Click "Sign Out"
- [ ] Redirected to login page
- [ ] Refresh page → should maintain login if signed in

## ⚙️ Configuration

### Phone Number Format
- **India**: +91XXXXXXXXXX (10 digits after +91)
- **USA**: +1XXXXXXXXXX (10 digits after +1)
- **UK**: +44XXXXXXXXXX (10 digits after +44)
- **Others**: +country-codeXXXXXXXXXX

### OTP Settings
- **Length**: 6 digits
- **Validity**: ~10 minutes
- **Resend**: Allowed multiple times
- **Max attempts**: 6 wrong tries, then block

### Firebase Quotas (Free Tier)
- **SMS**: 100 per day
- **Verification calls**: 100 per day
- **Users**: Unlimited
- **Bandwidth**: 1 GB/month

## 🐛 Troubleshooting

### Issue: "Firebase initialization error"
**Solution**: Check .env file has all Firebase credentials

### Issue: "reCAPTCHA not initialized"
**Solution**: Ensure .env has VITE_RECAPTCHA_SITE_KEY

### Issue: "OTP not received on phone"
**Solution**: 
- Check phone number format (must include country code)
- Check Firebase quota (free: 100 SMS/day)
- Wait few seconds, SMS sometimes delayed

### Issue: "Invalid OTP" error
**Solution**: 
- Wait 3-5 seconds from when SMS received
- OTP expires after ~10 minutes
- Click "Resend code" to get new OTP

### Issue: "Too many attempts" error
**Solution**: 
- Wait few minutes before retrying
- Firebase rate-limits after multiple failures
- Check internet connection

### Issue: Can't redirect after OTP verification
**Solution**:
- Check Redux state in browser DevTools
- Verify `isAuthenticated` is true
- Check ProtectedRoute component
- Clear browser cookies/localStorage

## 📚 Documentation

For detailed information, see:
- `FIREBASE_SETUP.md` - Complete setup guide
- `FIREBASE_INTEGRATION_SUMMARY.md` - Technical summary

## 🎯 Next Steps

1. **Test thoroughly** with test phone numbers
2. **Deploy to production** with real Firebase project
3. **Set up backend** to sync user data (optional)
4. **Add analytics** to track auth events
5. **Implement UI** for profile, settings
6. **Add phone verification** on backend

## 💡 Tips

- Bookmark Firebase Console for easy access
- Keep .env file secure (don't commit to git)
- Test on actual phone before production
- Monitor Firebase usage/quota
- Set up billing alerts (Firebase free tier is limited)

## 🆘 Need Help?

1. Check browser console (F12) for error messages
2. Check Firebase Console → Logs
3. Review `.env` file configuration
4. Test with Firebase test phone number
5. Read FIREBASE_SETUP.md for detailed steps

## ✅ Verification Checkpoints

After setup, verify these work:

```javascript
// In browser console:

// 1. Check Firebase is initialized
firebase // should have auth property

// 2. Check reCAPTCHA is ready
grecaptcha // should be available

// 3. Check Redux store
console.log(store.getState().auth)
// Should show: { user, token, isAuthenticated, etc }

// 4. Check localStorage
localStorage.getItem('token') // should have token if logged in
localStorage.getItem('user') // should have user object if logged in
```

---

**Setup Time**: ~5 minutes
**Difficulty**: Beginner-Friendly
**Support**: Firebase Docs + Code Comments

Happy coding! 🎉
