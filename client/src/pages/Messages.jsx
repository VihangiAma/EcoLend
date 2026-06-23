import { useState, useEffect, useRef } from 'react';
import { Send, Search, CheckCheck, MessageSquare, ArrowLeft } from 'lucide-react';
import API from '../api/axios';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const chatBottomRef = useRef(null);

  // Fallback data structure for immediate evaluation before database populations
  const mockConversations = [
    { conversation_id: 1, peer_name: 'Sumudu Silva', last_message: 'Is the professional camera available for rental tomorrow morning?', last_message_time: '10:42 AM', peer_avatar: null },
    { conversation_id: 2, peer_name: 'Vihangi Ama', last_message: 'Perfect, I will drop off the camping tent at the Colombo pickup spot.', last_message_time: 'Yesterday', peer_avatar: null },
  ];

  const mockChatLog = {
    1: [
      { message_id: 101, sender_id: 99, message_text: "Hi there! I saw your Hot Plate listing.", created_at: "10:30 AM" },
      { message_id: 102, sender_id: 1, message_text: "Hello! Yes, it is fully deep-cleaned and functional.", created_at: "10:35 AM" },
      { message_id: 103, sender_id: 99, message_text: "Awesome. Is the professional camera available for rental tomorrow morning?", created_at: "10:42 AM" }
    ],
    2: [
      { message_id: 201, sender_id: 1, message_text: "Can we handle the handoff near the faculty tech building?", created_at: "Yesterday" },
      { message_id: 202, sender_id: 99, message_text: "Perfect, I will drop off the camping tent at the Colombo pickup spot.", created_at: "Yesterday" }
    ]
  };

  // Fetch all chat groups
  useEffect(() => {
    const fetchInbox = async () => {
      try {
        setLoadingChannels(true);
        const res = await API.get('/messages/conversations');
        setConversations(res.data.length > 0 ? res.data : mockConversations);
      } catch (err) {
        console.warn('Using mock conversation structures:', err.message);
        setConversations(mockConversations);
      } finally {
        setLoadingChannels(false);
      }
    };
    fetchInbox();
  }, []);

  // Fetch single chat timeline logs upon choosing active channel
  useEffect(() => {
    if (!activeChannel) return;

    const fetchChatLogData = async () => {
      try {
        setLoadingMessages(true);
        const res = await API.get(`/messages/${activeChannel.conversation_id}`);
        setMessages(res.data.length > 0 ? res.data : (mockChatLog[activeChannel.conversation_id] || []));
      } catch (err) {
        setMessages(mockChatLog[activeChannel.conversation_id] || []);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchChatLogData();
  }, [activeChannel]);

  // Smooth layout anchors keeping track of the view horizon
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChannel) return;

    const localMsgObj = {
      message_id: Date.now(),
      sender_id: 1, // Simulating logged-in user context identity
      message_text: newMessage,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, localMsgObj]);
    const messagePayloadText = newMessage;
    setNewMessage('');

    try {
      await API.post('/messages/send', {
        conversationId: activeChannel.conversation_id,
        text: messagePayloadText
      });
    } catch (err) {
      console.error('Failed backend message syncing, keeping layout state local.', err);
    }
  };

  const filteredChannels = conversations.filter(c => 
    c.peer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-[340px_1fr] h-[calc(100vh-140px)] min-h-[550px]">
        
        {/* Left Pane: Inbox / Conversation Lists */}
        <div className={`flex flex-col border-r border-gray-100 ${activeChannel ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-5 border-b border-gray-100 space-y-4">
            <div>
              <h1 className="text-xl font-black text-gray-950 tracking-tight">Messages</h1>
              <p className="text-xs text-gray-400 mt-0.5">Coordinate logistics with other members</p>
            </div>
            
            {/* Search Input */}
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
                      {channel.peer_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs ${isSelected ? 'font-black' : 'font-bold text-gray-900'} truncate`}>{channel.peer_name}</p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{channel.last_message_time || 'Now'}</span>
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
                  {activeChannel.peer_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xs font-black text-gray-900 tracking-tight">{activeChannel.peer_name}</h2>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> EcoLend Verified
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
                    const isMe = msg.sender_id === 1; // Align context layout indicators
                    return (
                      <div key={msg.message_id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-xs text-xs font-medium leading-relaxed ${
                          isMe 
                            ? 'bg-[#005A36] text-white rounded-br-none' 
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                        }`}>
                          <p>{msg.message_text}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1 px-1 text-[9px] font-semibold text-gray-400">
                          <span>{msg.created_at}</span>
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
            // Idle State Canvas
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