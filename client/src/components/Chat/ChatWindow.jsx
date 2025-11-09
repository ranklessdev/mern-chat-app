import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Video, Phone, Search, MoreVertical, Paperclip, Smile, Send, MessageCircle, Users, UserPlus, UserMinus } from 'lucide-react'; 
import API from "../../api/api";
import { useAuth } from "../../context/AuthContext"; // Ensure useAuth is imported if used internally
import MessageBubble from "./MessageBubble"; 

// CRITICAL: Added onManageGroup prop
export default function ChatWindow({ activeChat, darkMode, user, socket, onManageGroup }) { 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null); 
  
  const chatId = activeChat?.id;
  const chatType = activeChat?.chatType;
  const isGroup = chatType === 'GROUP';
  const isAdmin = isGroup && activeChat?.adminId === user?._id; 


  // --- Data Fetching (History) ---
  const fetchMessages = useCallback(async () => {
    if (!chatId || !chatType) {
        setMessages([]);
        return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await API.get(`/messages?chatId=${chatId}&chatType=${chatType}`); 
      
      const mappedMessages = res.data.map(m => ({
          id: m._id,
          text: m.content,
          isMine: m.senderId === user._id,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          image: false,
          file: null,
          senderId: m.senderId, 
      }));
      setMessages(mappedMessages);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("Failed to load chat history.");
    } finally {
      setIsLoading(false);
    }
  }, [chatId, chatType, user._id]);

  useEffect(() => {
    fetchMessages(); 
  }, [fetchMessages]);

  // --- Real-time Socket Listener (No changes needed here) ---
  useEffect(() => {
    if (!socket || !chatId) return;

    const handleMessageReceived = (msg) => {
      const isRelevant = msg.chatId === chatId || (msg.chatType === 'DM' && msg.senderId === chatId);
                         
      if (isRelevant) {
        setMessages((prev) => {
            const isSender = msg.senderId === user._id;
            
            if (isSender) {
                const updatedMessages = prev.map(m => {
                    if (m.isMine && m.time === "Sending...") {
                        return {
                            id: msg._id,
                            text: msg.content,
                            isMine: true,
                            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            senderId: user._id
                        };
                    }
                    return m;
                });
                const alreadyExists = updatedMessages.some(m => m.id === msg._id);
                return alreadyExists ? updatedMessages : [...updatedMessages, { 
                    id: msg._id, 
                    text: msg.content, 
                    isMine: true, 
                    time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                    senderId: user._id 
                }];

            } else {
                return [...prev, {
                    id: msg._id,
                    text: msg.content,
                    isMine: false, 
                    time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    senderId: msg.senderId
                }];
            }
        });
      }
    };

    socket.on("messageReceived", handleMessageReceived);

    return () => {
      socket.off("messageReceived", handleMessageReceived);
    };
  }, [socket, chatId, user._id, chatType]);
  
  // --- Auto-scroll Effect ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // --- Send Message (via HTTP POST) ---
  const handleSend = async () => {
    if (!input.trim() || !chatId || !chatType) return;
    
    // 1. Optimistic UI Update 
    const tempMessage = {
        id: `temp-${Date.now()}`,
        text: input.trim(),
        isMine: true,
        time: "Sending...", 
        senderId: user._id,
    };
    setMessages((prev) => [...prev, tempMessage]);
    
    const messageContent = input.trim();
    setInput("");

    try {
        await API.post("/messages", {
            chatId: chatId, 
            chatType: chatType, 
            content: messageContent
        });
        
    } catch (err) {
        console.error("Failed to send message:", err);
        setMessages(prev => prev.filter(m => m.id !== tempMessage.id)); 
        setError("Failed to send message. Try again.");
    }
  };


  // --- Admin Action Logic (CRITICAL FIX: Call parent handler to open modal) ---
  const handleAddMember = () => {
      // This calls the handler in ChatPage.jsx to open the modal in 'add' mode
      if (onManageGroup) {
          onManageGroup('add');
      }
  };

  const handleRemoveMember = () => {
      // This calls the handler in ChatPage.jsx to open the modal in 'remove' mode
      if (onManageGroup) {
          onManageGroup('remove');
      }
  };


  if (isLoading) {
    return (
        <div className={`flex-1 flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} text-lg`}>
            Loading chat...
        </div>
    );
  }

  if (!activeChat) {
    return (
      <div className={`flex-1 flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`w-32 h-32 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <MessageCircle className={`w-16 h-16 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Select a chat</h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Choose a conversation or group to start messaging</p>
        </div>
      </div>
    );
  }

  const avatarText = activeChat.avatar || activeChat.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className={`flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3">
          {isGroup ? (
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">G</div>
          ) : (
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">{avatarText}</div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          )}
          <div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{activeChat.name}</h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{isGroup ? `${activeChat.members} members${isAdmin ? ' (Admin)' : ''}` : 'Online'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Admin Tools: Only show if it's a group and the current user is the admin */}
          {isAdmin && (
            <>
              <button 
                title="Add Member (Admin)"
                onClick={handleAddMember} 
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-green-400' : 'hover:bg-gray-100 text-green-600'}`}>
                  <UserPlus className="w-5 h-5" />
              </button>
              <button 
                title="Remove Member (Admin)"
                onClick={handleRemoveMember} 
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}>
                  <UserMinus className="w-5 h-5" />
              </button>
            </>
          )}

          <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}><Search className="w-5 h-5" /></button>
          <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}><MoreVertical className="w-5 h-5" /></button>
        </div>
      </div>

      {error && (
            <div className="bg-red-100 text-red-700 p-4 border-l-4 border-red-500" role="alert">
                <p>{error}</p>
            </div>
      )}

      <div className={`flex-1 overflow-y-auto p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              darkMode={darkMode} 
              showDate={index === 0} 
            />
          ))}
          <div ref={messagesEndRef} /> 
        </div>
      </div>

      <div className={`px-6 py-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}><Paperclip className="w-5 h-5" /></button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Write a message..."
            className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              darkMode
                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                : 'bg-white text-gray-800 placeholder-gray-500 border-gray-300'
            }`}
          />

          <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}><Smile className="w-5 h-5" /></button>

          <button
            onClick={handleSend}
            className="p-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}