# ✅ Real-Time Chat Setup Checklist

## Prerequisites
- [ ] Node.js and npm installed
- [ ] MySQL server running
- [ ] Both `client` and `server` folders have package.json
- [ ] Environment variables configured in `.env`

## Database Setup
- [ ] Run database schema: `mysql -u root -p resource_share_db < server/database-setup.sql`
- [ ] Verify `conversations` table created: `SHOW TABLES;`
- [ ] Verify `messages` table created: `SHOW TABLES;`

## Backend Setup
- [ ] Socket.io imported in `server/index.js` ✓
- [ ] messageRoutes added to middleware ✓
- [ ] Auth middleware configured ✓
- [ ] Server can start: `npm run dev` in server folder

## Frontend Setup
- [ ] Chat button added to ItemDetail ✓
- [ ] Messages page enhanced ✓
- [ ] Axios interceptor configured ✓
- [ ] Client can start: `npm run dev` in client folder

## Testing Checklist
- [ ] Create 2 test user accounts
- [ ] Log in with user 1
- [ ] Browse to item created by user 2
- [ ] Click "Chat" button
- [ ] Verify redirect to Messages page
- [ ] Type and send a test message
- [ ] Log in with user 2 in another window
- [ ] Verify message appears in real-time
- [ ] Reply from user 2
- [ ] Verify user 1 sees response instantly

## Performance Verification
- [ ] Check browser DevTools Network tab for real-time updates
- [ ] Open DevTools Console and look for Socket.io connection logs
- [ ] Verify no errors in browser console
- [ ] Verify no errors in server console

## Common Issues
- [ ] Port 5000 not in use
- [ ] Port 5173 not in use
- [ ] MySQL database accessible
- [ ] JWT token stored in localStorage after login
- [ ] CORS properly configured

## Completion
- [ ] All tests passing
- [ ] Chat working in real-time
- [ ] Messages persisting in database
- [ ] Ready for production

---
**Last Updated:** 2026-07-01
**Status:** Implementation Complete ✨
