# Firebase Phone Authentication Setup Guide

## Overview
This guide explains how to set up Firebase Phone Authentication (OTP) for the QuickCart React + Vite application.

## Prerequisites
- Firebase account (https://firebase.google.com)
- Google Cloud Project
- reCAPTCHA API keys

## Installation & Configuration

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or select existing project
3. Enable Google Analytics (optional)
4. Create the project

### Step 2: Set Up Firebase Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Phone** authentication
3. Click on "Phone" and toggle it ON
4. Save changes

### Step 3: Configure reCAPTCHA
Firebase Phone Authentication requires reCAPTCHA v3 for bot protection.

#### Get reCAPTCHA Keys:
1. Go to **Google Cloud Console** (linked to your Firebase project)
2. Navigate to **Security** → **reCAPTCHA Admin Console**
3. Create new reCAPTCHA (v3 Invisible) with:
   - **Display name**: QuickCart
   - **reCAPTCHA type**: reCAPTCHA v3
   - **Domains**: `localhost:5173`, `your-production-domain.com`
4. Copy Site Key and Secret Key

#### Register reCAPTCHA in Firebase:
1. In Firebase Console, go to **Project Settings** → **reCAPTCHA keys**
2. Add the reCAPTCHA Site Key

### Step 4: Get Firebase Credentials
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Under "Your apps", click **Web** app or create new
3. Copy the config:
   ```javascript
   {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   }
   ```

### Step 5: Set Environment Variables
Update `.env` file in your React project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Firebase reCAPTCHA Configuration
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key

# Backend API
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 6: Verify Installation
Run your app in development:
```bash
npm run dev
```

Open browser console (F12) and verify:
- ✅ "Firebase initialized successfully"
- ✅ "reCAPTCHA initialized successfully"
- No red error messages

## File Structure

```
src/
├── config/
│   └── firebase.js                  # Firebase config & initialization
├── utils/
│   ├── firebaseAuth.js              # Phone auth helper functions
│   └── recaptchaWidget.js           # reCAPTCHA widget management
├── api/
│   └── services/
│       └── authService.js           # Updated with Firebase OTP
├── queries/
│   └── authQueries.js               # TanStack Query hooks
├── hooks/
│   └── useInitializeAuth.js         # Firebase state sync hook
├── pages/
│   ├── Login.jsx                    # Updated with reCAPTCHA
│   └── Profile.jsx                  # Updated logout
├── store/
│   └── slices/
│       └── authSlice.js             # Redux auth state
└── components/
    └── ProtectedRoute.jsx           # Route protection
```

## API Reference

### authService.js
```javascript
import authService from '@/api/services/authService';

// Initialize reCAPTCHA (called in Login component)
authService.initRecaptcha('recaptcha-container');

// Send OTP to phone number
const result = await authService.sendOTP('+919876543210');
// Returns: { status, message, confirmationResult }

// Verify OTP
const result = await authService.verifyOTP(confirmationResult, '123456');
// Returns: { status, message, data, token, firebaseUser }

// Get current user
const user = await authService.getCurrentUser();

// Get user token
const token = await authService.getUserToken();

// Logout
await authService.logout();
```

### firebaseAuth.js
```javascript
import {
  sendOTPToPhone,
  verifyOTPCode,
  getCurrentUser,
  getUserToken,
  signOutUser,
  setupAuthStateListener,
} from '@/utils/firebaseAuth';

// Send OTP
const confirmationResult = await sendOTPToPhone(phoneNumber, recaptchaVerifier);

// Verify OTP
const userCredential = await verifyOTPCode(confirmationResult, otp);

// Get current user
const user = await getCurrentUser();

// Sign out
await signOutUser();

// Listen to auth state changes
const unsubscribe = setupAuthStateListener((user) => {
  if (user) {
    console.log('User logged in:', user.phoneNumber);
  } else {
    console.log('User logged out');
  }
});

// Cleanup
unsubscribe();
```

### React Hooks

#### useSendOTP
```javascript
const { mutate: sendOTP, isPending, error } = useSendOTP();

sendOTP('+919876543210', {
  onSuccess: (data) => {
    // data = { status, message, confirmationResult }
  },
  onError: (error) => {
    // Handle error
  },
});
```

#### useVerifyOTP
```javascript
const { mutate: verifyOTP, isPending, error } = useVerifyOTP();

verifyOTP(
  { confirmationResult, otp: '123456' },
  {
    onSuccess: (data) => {
      // User authenticated, Redux state updated
      // data = { status, message, data, token }
    },
    onError: (error) => {
      // Handle error
    },
  }
);
```

#### useLogout
```javascript
const { mutate: logout, isPending } = useLogout();

logout({
  onSuccess: () => {
    // User logged out, navigate to login
  },
});
```

## State Management (Redux)

### authSlice
```javascript
{
  user: {
    id: string,
    phoneNumber: string,
    name?: string,
  },
  token: string,              // Firebase ID token
  firebaseUser: {             // Firebase user object
    uid: string,
    phoneNumber: string,
    metadata: {...}
  },
  isAuthenticated: boolean
}
```

## Error Handling

Common Firebase errors and messages:

| Error Code | Message |
|-----------|---------|
| `auth/invalid-phone-number` | Invalid phone number format |
| `auth/too-many-requests` | Too many requests. Try later |
| `auth/invalid-verification-code` | Invalid OTP code |
| `auth/code-expired` | OTP has expired |
| `auth/operation-not-allowed` | Phone auth disabled |
| `auth/network-request-failed` | Network error |

## Security Best Practices

✅ **Implemented in this setup:**
- reCAPTCHA v3 bot protection
- Firebase session persistence
- Secure auth state management
- Protected routes
- Automatic token refresh

⚠️ **Additional Security (implement yourself):**
- CORS configuration on backend
- Rate limiting on OTP requests
- Phone number validation on backend
- Additional user verification steps
- SSL/HTTPS in production
- Content Security Policy headers

## Production Deployment

### Update Firebase Rules
```javascript
// Firestore/Realtime Database rules
match /users/{uid} {
  allow read, write: if request.auth.uid == uid;
}
```

### Update .env for Production
```env
VITE_FIREBASE_API_KEY=prod_key
VITE_FIREBASE_AUTH_DOMAIN=prod_domain
...
VITE_RECAPTCHA_SITE_KEY=prod_recaptcha_key
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Update Firebase reCAPTCHA Domains
1. Firebase Console → Project Settings → reCAPTCHA keys
2. Add production domains

### Enable in Google Cloud
1. Enable SMS API for international use
2. Set up Cloud Identity-Aware Proxy (optional)
3. Whitelist phone number regions if needed

## Troubleshooting

### "reCAPTCHA not initialized"
- Ensure `<div id="recaptcha-container"></div>` exists in Login component
- Call `authService.initRecaptcha()` in useEffect

### "Phone authentication disabled"
- Go to Firebase Console → Authentication → Sign-in method
- Enable "Phone" provider

### OTP not received
- Check Firebase Project Settings → Authentication
- Verify phone number format (must include country code)
- Check if quota is exceeded (Firebase free tier: 100 SMS/day)

### "Operation not allowed"
- Ensure Phone authentication is enabled in Firebase
- Check if reCAPTCHA is configured

## Testing

### Test Phone Numbers
Firebase provides test numbers for development:
1. Go to Firebase Console → Authentication → Settings
2. Add test phone numbers
3. Use format: +1xxxxxxxxxxxx (with any OTP)

### Example Test Number
```
+1 (555) 012-3456
```
Use any 6-digit code for verification.

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Configure environment variables
3. ✅ Test Login flow
4. ✅ Implement user profile syncing with backend
5. ✅ Set up analytics (optional)
6. ✅ Deploy to production

## Resources

- [Firebase Phone Authentication Docs](https://firebase.google.com/docs/auth/web/phone-auth)
- [reCAPTCHA Setup Guide](https://cloud.google.com/recaptcha-enterprise/docs)
- [Firebase Security Best Practices](https://firebase.google.com/docs/database/security)
- [vite.js Documentation](https://vitejs.dev)

## Support

For issues:
1. Check Firebase Console logs
2. Review browser console for errors
3. Verify .env variables are set correctly
4. Check Firebase Authentication quotas

---

**Last Updated**: May 2026
**Firebase SDK**: v9.x+
**React Version**: 19.x+
**Vite Version**: 8.x+
