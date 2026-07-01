# Real-Time Chat Implementation Guide

## Overview
This document explains the real-time chat functionality that has been implemented in EcoLend. Users can now chat directly with item lenders from the item details page using WebSocket technology.

## 🚀 Features Implemented

### 1. **Chat Button on Item Details**
- Added a "Chat" button next to the "Request Borrow" button
- When clicked, it creates or retrieves an existing conversation with the item owner
- Redirects to the Messages page with the conversation selected

### 2. **Real-Time Message Exchange**
- Uses Socket.io for WebSocket connection
- Messages are sent and received instantly without page refresh
- Automatic connection handling and room joining

### 3. **Conversation Management**
- Creates conversations automatically on first chat
- Displays conversation history when viewing existing chats
- Shows last message preview in the conversations list

### 4. **Authentication Integration**
- Uses JWT tokens for secure authentication
- Axios automatically includes token in all API requests
- Message routes are protected with verifyToken middleware

## 📋 Setup Instructions

### Step 1: Create Database Tables
Run the following SQL commands or execute the setup script:

```bash
mysql -u root -p resource_share_db < server/database-setup.sql
```

Or paste these SQL commands directly:

```sql
CREATE TABLE IF NOT EXISTS conversations (
  conversation_id INT PRIMARY KEY AUTO_INCREMENT,
  user_one_id INT NOT NULL,
  user_two_id INT NOT NULL,
  item_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_one_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (user_two_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE SET NULL,
  INDEX idx_users (user_one_id, user_two_id),
  INDEX idx_updated (updated_at)
);

CREATE TABLE IF NOT EXISTS messages (
  message_id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  message_text LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_conversation (conversation_id),
  INDEX idx_sender (sender_id),
  INDEX idx_created (created_at)
);
```

### Step 2: Install Dependencies (Already Done)
Both client and server already have Socket.io installed:
- Client: `socket.io-client` v4.8.3
- Server: `socket.io` v4.8.3

### Step 3: Start the Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Step 4: Test the Functionality

1. Open the application in your browser (usually http://localhost:5173)
2. Create two test accounts or use existing accounts
3. Log in with the first account
4. Browse to an item created by a different user
5. Click the "Chat" button
6. You should be redirected to the Messages page with the conversation selected
7. Type a message and send it
8. Log in with the second account and verify you can see and reply to the message

## 🔄 How It Works

### User Flow:
1. **User clicks Chat button on Item Details**
   - ItemDetail.jsx: `startNegotiationChat()` function is triggered
   - Sends POST request to `/messages/create-conversation`

2. **Backend creates/retrieves conversation**
   - messageRoutes.js: `create-conversation` endpoint
   - Checks if conversation already exists between users
   - Creates new conversation if needed
   - Returns conversation ID

3. **User navigated to Messages page**
   - Conversation is automatically selected and displayed
   - Chat history loads from database
   - Socket.io connection established

4. **Real-time messaging**
   - User types message and sends
   - Message emitted via Socket.io to other user
   - Message saved to database
   - Both users see message instantly

### Architecture:

```
FRONTEND (React + Socket.io-client)
    ↓
ItemDetail → startNegotiationChat()
    ↓
axios.post('/messages/create-conversation')
    ↓
BACKEND (Express + Socket.io)
    ↓
messageRoutes.js → create-conversation
    ↓
Database: conversations table
    ↓
Socket.io: emit receive_message
    ↓
FRONTEND: Messages.jsx receives message
    ↓
Display in chat UI
```

## 📁 Modified Files

### Frontend:
- `client/src/pages/ItemDetail.jsx` - Added chat button and conversation creation logic
- `client/src/pages/Messages.jsx` - Enhanced to handle auto-selection of conversations
- `client/src/api/axios.js` - Added authorization interceptor

### Backend:
- `server/index.js` - Added messageRoutes middleware, removed duplicate endpoints
- `server/routes/messageRoutes.js` - Updated with create-conversation endpoint and proper auth
- `server/database-setup.sql` - Created schema file

## 🔐 Security Features

- ✅ JWT authentication on all message endpoints
- ✅ Token validation through middleware
- ✅ User can only access their own conversations
- ✅ Messages are permanently stored in database
- ✅ Indexes on frequently queried columns for performance

## 📦 Dependencies

Already installed:
- **socket.io**: Real-time communication
- **socket.io-client**: Client-side Socket.io
- **axios**: HTTP requests with interceptors
- **react-router-dom**: Navigation handling

## 🐛 Troubleshooting

### "Chat button doesn't work"
- ✅ Make sure you're logged in
- ✅ Ensure JWT token is in localStorage
- ✅ Check browser console for errors
- ✅ Verify server is running on port 5000

### "Messages not sending"
- ✅ Check database tables exist (run database-setup.sql)
- ✅ Verify Socket.io connection established
- ✅ Check network tab in developer tools
- ✅ Ensure backend is running

### "Can't see old messages"
- ✅ Refresh the messages page
- ✅ Check that conversation_id is correct in database
- ✅ Verify both users exist in users table

### "Real-time not working"
- ✅ Confirm Socket.io connection in browser console
- ✅ Check CORS settings in server/index.js
- ✅ Verify firewall isn't blocking WebSocket (port 5000)
- ✅ Restart both frontend and backend

## 🚀 Future Enhancements

Consider implementing:
- Typing indicators ("User is typing...")
- Read receipts
- Message search functionality
- Group conversations
- File sharing in messages
- Message reactions/emojis
- Notification for new messages

## 📞 Support

If you encounter issues:
1. Check the browser console for client-side errors
2. Check server console for backend errors
3. Verify database connection with test query
4. Ensure all ports (5000, 5173) are accessible
5. Check Socket.io connection status in DevTools

---

**Last Updated:** 2026-07-01
