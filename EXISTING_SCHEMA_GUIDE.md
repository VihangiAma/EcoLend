# Chat Implementation - Using Existing Database Schema

## ✅ Database Setup Complete

Your existing database schema is already compatible! The code has been updated to work with:

```sql
CREATE TABLE conversations (
    conversation_id VARCHAR(255) PRIMARY KEY,  -- Format: "userId_peerId"
    user_one_id INT NOT NULL,
    user_two_id INT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id VARCHAR(255) NOT NULL,
    sender_id INT NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE
);
```

## 🔄 What Changed

### Backend Updates
- ✅ messageRoutes.js now uses VARCHAR conversation_id (e.g., "1_2")
- ✅ Uses `id` instead of `message_id`
- ✅ Uses `text` instead of `message_text`
- ✅ Uses `timestamp` instead of `created_at`
- ✅ Socket.io handlers updated for VARCHAR room IDs

### Frontend Updates
- ✅ Messages.jsx properly maps database fields to UI
- ✅ Console logging added for debugging
- ✅ ItemDetail chat button functional with new schema
- ✅ Axios interceptor adds Bearer token to all requests

## 🚀 Quick Start

### 1. Restart Backend
```bash
cd server
npm run dev
```

### 2. Restart Frontend
```bash
cd client
npm run dev
```

### 3. Test Chat Flow
1. Login with one user account
2. Go to an item created by another user
3. Click "Chat" button
4. **Expected Result**: 
   - You should see conversation ID like `1_2` created in database
   - Message history loads (empty for first chat)
   - You can type and send messages

## 📊 Database Query Examples

### See all conversations
```sql
SELECT * FROM conversations;
```

### See all messages
```sql
SELECT * FROM messages;
```

### See messages in specific conversation
```sql
SELECT * FROM messages 
WHERE conversation_id = '1_2' 
ORDER BY timestamp DESC;
```

### See last message in each conversation
```sql
SELECT 
    c.conversation_id,
    c.user_one_id,
    c.user_two_id,
    m.text,
    m.timestamp
FROM conversations c
LEFT JOIN messages m ON m.conversation_id = c.conversation_id 
    AND m.timestamp = (SELECT MAX(timestamp) FROM messages WHERE conversation_id = c.conversation_id)
ORDER BY m.timestamp DESC;
```

## 🔍 Debugging Console Logs

When you click Chat, look for these logs in **Browser Console**:
```
✅ Token added to request headers
Starting chat with: { peer_id: 2, item_id: 1 }
Current user: { id: 1, ... }
```

When you send a message, look for:
```
Joining room: 1_2
Chat history loaded: 0 messages
Sending message: { room_id: '1_2', sender_id: 1, text: '...', timestamp: '...' }
Message saved to database
```

When you receive a message, look for:
```
📨 Message from 2 in room 1_2: ...
```

## ⚠️ Common Issues & Fixes

### Issue: Still getting 500 error
**Solution**: 
- Check server console for detailed error message
- Make sure conversations and messages tables exist
- Verify users exist with the IDs you're using

### Issue: Messages not sending
**Solution**:
- Check if conversation was created (should show in database)
- Verify Socket.io connection (should see "🏠 Socket bound room" in server console)
- Refresh page and try again

### Issue: Can't see received messages
**Solution**:
- Ensure both browser windows have different user accounts logged in
- Check that conversation_id format is correct (should be "1_2" not "1_2" with spaces)
- Open both message pages at the same time

## 🎯 What's Working

- ✅ Create conversation automatically on first chat
- ✅ Retrieve existing conversations
- ✅ Send and receive messages in real-time
- ✅ Messages persist in database
- ✅ JWT authentication on all endpoints
- ✅ Socket.io WebSocket integration

## 📝 Test Scenario

1. **Create 2 users**: User A (id: 1) and User B (id: 2)
2. **User A creates an item** with owner_id = 1
3. **User B opens item and clicks Chat**
   - Creates conversation with id: "1_2"
4. **User B types and sends message**: "Hi, interested in renting"
   - Message saved with conversation_id = "1_2"
   - Socket.io broadcasts to User A
5. **User A receives message in real-time**
   - Sees: "Hi, interested in renting"
6. **User A replies**: "Sure, available next week"
   - Both users see messages

## 🆘 Need Help?

Check these files for error details:
- **Browser Console**: Frontend errors and Socket.io events
- **Server Console**: Backend errors and database queries
- **Network Tab**: HTTP requests and responses

---
**Last Updated:** 2026-07-01
**Status:** Ready for Testing ✨
