# Token Authentication Troubleshooting

## 🔍 Issue: 403 Forbidden - No Token Provided

When clicking Chat button, you get:
```
POST http://localhost:5000/api/messages/create-conversation 403 (Forbidden)
Error: No token provided
```

## 🔧 Debugging Steps

### Step 1: Check if User is Logged In
1. Open Browser DevTools (F12)
2. Go to Application → LocalStorage
3. Look for key: `token`
4. If NOT there, user is NOT logged in
   - **Solution**: Login first before accessing chat

### Step 2: Verify Token Format
In Browser Console, run:
```javascript
const token = localStorage.getItem('token');
console.log('Token:', token);
console.log('Token length:', token?.length);
console.log('Token starts with:', token?.substring(0, 20));
```

**Expected**: Should show a long JWT string like `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 3: Check Axios Headers
In Browser Console when making a request:
```javascript
// Will show if token is being added
// Look for: ✅ Token added to request headers
```

### Step 4: Check Network Request
1. Open DevTools Network tab
2. Click Chat button
3. Find the POST request to `create-conversation`
4. Click on it and view Headers
5. Look for: `Authorization: Bearer eyJhbGciOiJI...`

**If NOT there:**
- Axios interceptor may not be working
- Token may not be in localStorage at time of request

**If IS there:**
- Token is being sent
- Check server logs for verification errors

### Step 5: Check Server Logs
Look at server console output when making request:

```
🔐 Auth Check: { header: 'Present', allHeaders: [...] }
✅ Token verified for user: 12
```

**If you see:**
```
❌ No authorization header provided
```
→ Token not being sent by client

**If you see:**
```
❌ Invalid token format. Expected "Bearer <token>"
```
→ Token format incorrect (should be `Bearer <token>`, not just `<token>`)

**If you see:**
```
❌ Token verification failed: jwt malformed
```
→ Token is corrupted or incomplete

## 🛠️ Common Solutions

### Solution 1: Clear Cache and Re-login
1. Close all browser tabs with app
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart app
4. Login again
5. Try chat

### Solution 2: Check Login Response
When you login, check if token is returned:

In Browser Console during login:
```javascript
// After login, check:
console.log(localStorage.getItem('token'));
```

Should print a long JWT string.

### Solution 3: Verify Backend JWT_SECRET
In server `.env` file:
```
JWT_SECRET=secretkey123
```

Make sure it matches what's used in auth.js

### Solution 4: Test Token Manually
In Browser Console:
```javascript
import API from './src/api/axios.js';

// Test request with token
API.post('/auth/me')
  .then(res => console.log('Success:', res.data))
  .catch(err => console.log('Error:', err.response?.data));
```

## 📋 Quick Checklist

- [ ] User is logged in (token in localStorage)
- [ ] Token is not empty
- [ ] Token format is: `eyJhbGc...` (JWT format)
- [ ] Token starts with "eyJ" (Base64 for JWT header)
- [ ] Axios request shows Authorization header
- [ ] Server logs show token being received
- [ ] Server JWT_SECRET matches .env file

## 🚀 Step-by-Step Fix

1. **Restart Servers**
   ```bash
   # Terminal 1
   cd server && npm run dev
   
   # Terminal 2
   cd client && npm run dev
   ```

2. **Clear Browser Cache**
   - Press Ctrl+Shift+Delete
   - Select "All time"
   - Clear cache

3. **Login Again**
   - Navigate to /login
   - Enter credentials
   - Check console: should see "✅ Token added to request headers"

4. **Test Chat**
   - Go to an item
   - Click Chat button
   - Check console output:
     - Should see: "✅ Token added to request headers"
     - Should see: "✅ Conversation created"

5. **If Still Failing**
   - Open Network tab
   - Make request
   - Check Authorization header is present
   - Check server console for error details

## 🔐 Full Request Flow

```
1. User Login
   ↓
2. Server returns token
   ↓
3. Client stores token in localStorage
   ↓
4. User clicks Chat
   ↓
5. Axios interceptor checks localStorage
   ↓
6. Token added to Authorization header: "Bearer <token>"
   ↓
7. Request sent to server
   ↓
8. Auth middleware verifies token
   ↓
9. Route handler processes request
```

## 📝 Server Console Output

**Success:**
```
🔐 Auth Check: { header: 'Present', allHeaders: [...] }
✅ Token verified for user: 12
Creating conversation - userId: 12 peer_id: 11
```

**Failure:**
```
❌ No authorization header provided
```

## 🆘 If Still Not Working

1. Check server is running: `http://localhost:5000/api/test`
2. Check client is running: `http://localhost:5173`
3. Check database is connected
4. Check console for all error messages
5. Restart both servers and clear cache

---

**Last Updated:** 2026-07-01
