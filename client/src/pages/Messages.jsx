import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Search, CheckCheck, MessageSquare, ArrowLeft } from 'lucide-react';
import { io } from 'socket.io-client';
import API from '../api/axios';
import { useLanguage } from '../contexts/LanguageContext';
import { useChat } from '../contexts/ChatContext';

// Connect socket connection to backend application framework port - Single instance
const socket = io("http://localhost:5000", { 
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

export default function Messages() {
  const { t } = useLanguage();
  const { updateUnreadCount, clearUnreadCount } = useChat();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const chatBottomRef = useRef(null);
  const hasInitialized = useRef(false);
  const activeChannelRef = useRef(activeChannel);

  // Update ref whenever activeChannel changes
  useEffect(() => {
    activeChannelRef.current = activeChannel;
  }, [activeChannel]);

  // Safe parsing of authenticated active context tracking parameters
  const userSessionData = localStorage.getItem("user");
  const currentUser = userSessionData ? JSON.parse(userSessionData) : null;

  // Phase A: Initialize Socket connection ONCE on component mount
  useEffect(() => {
    if (!currentUser || hasInitialized.current) return;
    
    hasInitialized.current = true;
    console.log('🔗 Initializing Socket.io connection...');
    
    socket.connect();

    socket.on("connect", () => {
      console.log('✅ Socket connected:', socket.id);
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log('❌ Socket disconnected');
      setSocketConnected(false);
    });

    // Catch incoming messages from the websocket
    socket.on("receive_message", (incomingData) => {
      console.log('📨 Received message in room:', incomingData.room_id);
      // Use ref to get current activeChannel value
      if (activeChannelRef.current && incomingData.room_id === activeChannelRef.current.conversation_id) {
        setMessages((prev) => [...prev, {
          message_id: Date.now(),
          sender_id: incomingData.sender_id,
          message_text: incomingData.text,
          created_at: new Date(incomingData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }

      // Update the left conversation panel's item previews in real-time
      setConversations((prev) => 
        prev.map(c => c.conversation_id === incomingData.room_id 
          ? { ...c, last_message: incomingData.text, last_message_time: t('now') || 'Now' }
          : c
        )
      );
    });

    return () => {
      // Don't disconnect on unmount - keep connection alive
      // Just remove listeners
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receive_message");
    };
  }, [currentUser]); // Only depend on currentUser, not activeChannel

  // Phase B: Fetch conversations list on component mount and calculate unread count
  useEffect(() => {
    const fetchInbox = async () => {
      try {
        setLoadingChannels(true);
        const res = await API.get('/messages/conversations');
        const conversationList = res.data || [];
        setConversations(conversationList);
        console.log('✅ Conversations loaded:', conversationList.length);

        // Calculate unread count (conversations that have messages and aren't currently open)
        // For now, we'll mark all conversations as having 1 unread each if there are unviewed messages
        const unreadCount = conversationList.length > 0 ? conversationList.length : 0;
        updateUnreadCount(unreadCount);
        console.log('📬 Unread conversations:', unreadCount);

        // If coming from ItemDetail with selectedConversation, set it as active
        if (location.state?.selectedConversation) {
          const selected = conversationList.find(c => c.conversation_id === location.state.selectedConversation);
          if (selected) {
            setActiveChannel(selected);
            console.log('📌 Selected conversation:', selected.conversation_id);
            // When opening a conversation, decrement unread count
            updateUnreadCount(Math.max(0, unreadCount - 1));
          }
        }
      } catch (err) {
        console.error('❌ Error fetching conversations inbox:', err);
        setConversations([]);
      } finally {
        setLoadingChannels(false);
      }
    };
    
    if (currentUser) {
      fetchInbox();
    }
  }, []); // Empty dependency - only run once on mount

  // Phase C: Handle channel selection changes & room joining actions
  useEffect(() => {
    if (!activeChannel || !currentUser) return;

    console.log('🏠 Joining room:', activeChannel.conversation_id);
    
    // When user opens a conversation, decrement unread count
    clearUnreadCount();
    
    // Join room pipeline with conversation_id as room identifier
    socket.emit("join_room", { 
      roomId: activeChannel.conversation_id, 
      userId: currentUser.id 
    });

    // Fetch chat history for this conversation
    const fetchChatLogData = async () => {
      try {
        setLoadingMessages(true);
        const res = await API.get(`/messages/${activeChannel.conversation_id}`);
        console.log('✅ Chat history loaded:', res.data?.length, 'messages');
        setMessages(res.data || []);
      } catch (err) {
        console.error('❌ Error fetching conversation logs:', err);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchChatLogData();
    
    // No cleanup needed - we want to stay in the room
  }, [activeChannel?.conversation_id, currentUser?.id]); // Only depend on specific IDs, not the whole objects

  // Handle smooth structural viewing focus limits
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChannel || !currentUser) return;

    const messagePayload = {
      room_id: activeChannel.conversation_id,
      sender_id: currentUser.id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    console.log('Sending message:', messagePayload);

    // 1. Send across the realtime channel pipeline
    socket.emit("send_message", messagePayload);

    // 2. Optimistically paint interface frame locally (match database schema field names)
    const localMsgObj = {
      message_id: Date.now(),
      sender_id: currentUser.id,
      message_text: messagePayload.text,
      created_at: new Date(messagePayload.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, localMsgObj]);
    setNewMessage('');

    // Update index preview logs tracking item state
    setConversations((prev) => 
      prev.map(c => c.conversation_id === activeChannel.conversation_id 
        ? { ...c, last_message: messagePayload.text, last_message_time: t('now') || 'Now' }
        : c
      )
    );

    // 3. Commit backend database persistence records
    try {
      await API.post('/messages/send', {
        conversationId: activeChannel.conversation_id,
        text: messagePayload.text
      });
      console.log('Message saved to database');
    } catch (err) {
      console.error('Failed API pipeline back-syncing logs:', err.response?.data || err.message);
    }
  };

  const filteredChannels = conversations.filter(c => 
    c.peer_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-[340px_1fr] h-[calc(100vh-140px)] min-h-[550px]">
        
        {/* Left Pane: Inbox / Conversation Lists */}
        <div className={`flex flex-col border-r border-gray-100 ${activeChannel ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-5 border-b border-gray-100 space-y-4">
            <div>
              <h1 className="text-xl font-black text-gray-950 tracking-tight">{t('navMessages')}</h1>
              <p className="text-xs text-gray-400 mt-0.5">Coordinate logistics with other members</p>
            </div>
            
            {/* Search Input Framework */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2 text-xs font-medium outline-none focus:border-[#005A36] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Conversations Loop Container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-gray-50/50">
            {loadingChannels ? (
              <div className="flex justify-center py-12">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#005A36] border-t-transparent" />
              </div>
            ) : filteredChannels.length === 0 ? (
              <div className="text-center py-12 text-xs text-gray-400 font-medium">No conversations found.</div>
            ) : (
              filteredChannels.map((channel) => {
                const isSelected = activeChannel?.conversation_id === channel.conversation_id;
                return (
                  <button
                    key={channel.conversation_id}
                    onClick={() => setActiveChannel(channel)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
                      isSelected 
                        ? 'bg-[#005A36]/10 text-[#005A36] border border-[#005A36]/10 shadow-xs font-semibold' 
                        : 'hover:bg-white border border-transparent text-gray-700 hover:shadow-xs'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-[#005A36]/10 text-[#005A36] font-bold text-sm flex items-center justify-center border border-[#005A36]/5 shrink-0">
                      {channel.peer_name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs ${isSelected ? 'font-black' : 'font-bold text-gray-900'} truncate`}>{channel.peer_name}</p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{channel.last_message_time || t('now') || 'Now'}</span>
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-[#005A36]/80 font-medium' : 'text-gray-400'}`}>
                        {channel.last_message || 'Tap to open chat room'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Workspace Chat Log Area */}
        <div className={`flex flex-col bg-gray-50/30 ${!activeChannel ? 'hidden md:flex' : 'flex'}`}>
          {activeChannel ? (
            <>
              {/* Active Header Canvas */}
              <div className="bg-white p-4 border-b border-gray-100 flex items-center gap-3">
                <button 
                  onClick={() => setActiveChannel(null)}
                  className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 md:hidden"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="h-9 w-9 rounded-full bg-[#005A36] text-white font-black text-xs flex items-center justify-center shadow-xs">
                  {activeChannel.peer_name?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xs font-black text-gray-900 tracking-tight">{activeChannel.peer_name}</h2>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> {t('verifiedLender') || "EcoLend Verified"}
                  </p>
                </div>
              </div>

              {/* Chat Thread Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#005A36] border-t-transparent" />
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender_id === currentUser?.id;
                    return (
                      <div key={msg.message_id || msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-xs text-xs font-medium leading-relaxed ${
                          isMe 
                            ? 'bg-[#005A36] text-white rounded-br-none' 
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                        }`}>
                          <p>{msg.message_text || msg.text}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1 px-1 text-[9px] font-semibold text-gray-400">
                          <span>{msg.created_at || new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && <CheckCheck size={11} className="text-emerald-600" />}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Input Action Form Area */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
                <input
                  type="text"
                  placeholder={`Write a message to ${activeChannel.peer_name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-[#005A36] focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-[#005A36] text-white p-3 rounded-xl hover:bg-[#004428] transition-all disabled:opacity-30 disabled:scale-100 active:scale-95 shadow-xs shrink-0"
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          ) : (
            // Idle State Canvas Workspace
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white m-4 rounded-[1.5rem] border border-gray-100">
              <div className="h-12 w-12 rounded-2xl bg-gray-50 text-gray-400 border border-gray-100 flex items-center justify-center mb-3 shadow-2xs">
                <MessageSquare size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Your Chat Workspace</h3>
              <p className="text-xs text-gray-400 max-w-xs mt-1 leading-relaxed">
                Select a user transaction channel from the side panel to coordinate pickups, handoffs, and rental intervals.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}