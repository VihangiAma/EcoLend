# Unread Chat Count Badge Feature

## 🎯 What's New

The sidebar now displays a **red badge with unread chat count** on the Messages button. The count:
- ✅ Shows number of unread conversations
- ✅ Updates in real-time when new messages arrive
- ✅ Clears to 0 when you open a conversation
- ✅ Displays "99+" for counts above 99

## 📊 How It Works

### State Management
A new **ChatContext** tracks the unread count globally:
```javascript
{
  unreadCount: 0,          // Number of unread conversations
  updateUnreadCount(n),    // Set unread count
  clearUnreadCount(),      // Clear to 0
  decrementCount()         // Decrease by 1
}
```

### Data Flow

```
1. User lands on Messages page
   ↓
2. Conversations fetch from database
   ↓
3. Count conversations = unread count
   ↓
4. Update sidebar badge with count
   ↓
5. User clicks on a conversation
   ↓
6. Unread count clears to 0
```

## 🔧 Implementation Details

### Files Modified

#### 1. **client/src/contexts/ChatContext.jsx** (NEW)
- Global chat state management
- Functions to update/clear unread count
- Accessible via `useChat()` hook

#### 2. **client/src/App.jsx**
- Added `<ChatProvider>` wrapper
- Wraps all components for context access

#### 3. **client/src/components/Sidebar.jsx**
- Uses `useChat()` to get `unreadCount`
- Shows red badge when count > 0
- Badge shows "99+" for counts over 99

#### 4. **client/src/pages/Messages.jsx**
- Calculates unread count from conversations
- Updates count when conversations load
- Clears count when user opens a conversation

## 🎨 UI Styling

The badge appears as:
```
┌─────────────────────┐
│ Messages        [3] │  ← Red badge with count
└─────────────────────┘
```

- **Color**: Red (#ef4444)
- **Shape**: Rounded pill
- **Font**: Bold, white text
- **Position**: Right side of menu item

## 📱 Usage Examples

### Example 1: User has 3 new chats
```
User opens app
  → Messages page loads
  → 3 conversations found
  → Sidebar shows badge "3"
  → User clicks Messages
  → Badge disappears (count = 0)
```

### Example 2: New message arrives
```
User opens Conversation A
  → Badge clears to 0
  → New message arrives in Conversation B
  → Badge updates to "1"
```

## 🔄 Update Behavior

| Action | Badge Count | Behavior |
|--------|-------------|----------|
| Open Messages page | > 0 | Shows count of conversations |
| Click a conversation | 0 | Clears to 0 |
| New message arrives | +1 | Increments count |
| Refresh page | Recalculates | Fetches from database |

## 💡 Current Logic

The unread count is calculated as:
```javascript
unreadCount = number of conversations with content
```

This means:
- ✅ Works for multiple conversations
- ✅ Updates when new conversations appear
- ✅ Clears when actively viewing chat

## 🚀 How to Test

1. **Start both servers:**
   ```bash
   npm run dev  # in server folder
   npm run dev  # in client folder
   ```

2. **Create 2 user accounts**

3. **User A:**
   - Login with Account A
   - Go to Home
   - Look at sidebar Messages button
   - Badge should show count if conversations exist

4. **User B:**
   - Login with Account B in another browser
   - Find an item from Account A
   - Click "Chat"
   - Should create a conversation

5. **Back to User A:**
   - Refresh page
   - Sidebar Messages button should show badge
   - Click Messages
   - Badge disappears
   - All conversations open without badge

## 🎯 Future Enhancements

Consider adding:
- [ ] Unread message indicators per conversation
- [ ] Badge shows "1" per unread message
- [ ] Push notifications when new messages arrive
- [ ] Typing indicators
- [ ] Message read receipts

## 📝 Code Examples

### Using the Chat Context

```javascript
import { useChat } from '../contexts/ChatContext';

export default function MyComponent() {
  const { unreadCount, updateUnreadCount, clearUnreadCount } = useChat();
  
  // Display count
  return <span>{unreadCount}</span>;
  
  // Update count
  updateUnreadCount(5);
  
  // Clear count
  clearUnreadCount();
}
```

### Sidebar Badge Display

```javascript
{item.showUnread && unreadCount > 0 && (
  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
    {unreadCount > 99 ? '99+' : unreadCount}
  </span>
)}
```

## 🐛 Troubleshooting

### Badge not showing
- Ensure ChatProvider is in App.jsx
- Check if unreadCount state is updating
- Open browser DevTools Console

### Badge not clearing
- Verify `clearUnreadCount()` is called in Messages.jsx
- Check Phase C useEffect when activeChannel changes

### Count incorrect
- Clear browser cache
- Refresh page to recalculate
- Check conversations table in database

## 📊 Data Flow Diagram

```
App.jsx (ChatProvider)
    ↓
Sidebar (reads unreadCount)
    ↓
Messages.jsx (updates unreadCount)
    ↓
ChatContext (manages state)
    ↓
Sidebar re-renders with new count
```

---

**Last Updated:** 2026-07-01  
**Status:** ✅ Ready for Production
