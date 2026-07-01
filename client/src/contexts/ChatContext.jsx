import { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const updateUnreadCount = (count) => {
    setUnreadCount(Math.max(0, count)); // Ensure count never goes below 0
  };

  const clearUnreadCount = () => {
    setUnreadCount(0);
  };

  const decrementCount = () => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const value = {
    unreadCount,
    updateUnreadCount,
    clearUnreadCount,
    decrementCount
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
