import React, { useState } from "react";
import { Search, Plus, Archive, Users } from "lucide-react";
import ChatItem from "./ChatItem";

// CRITICAL: Props renamed and simplified. It receives the 'chats' array from ChatPage.
export default function ChatListPanel({ chats = [], activeChat, onSelectChat, darkMode = false, onOpenGroupModal }) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // NOTE: Loading logic is now mainly handled by the parent (ChatPage)
  const filtered = chats.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // No need for re-mapping, as ChatPage already provided a clean chat object.
  const handleSelectChat = (chatItem) => {
    if (onSelectChat) {
      onSelectChat(chatItem); 
    }
  };

  return (
    <div className={`w-96 border-r flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Chats
          </h2>
          <button 
            title="Create Group" 
            onClick={onOpenGroupModal} // CRITICAL: Open the group creation modal
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <Users className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-100 text-gray-800 placeholder-gray-500 border-gray-200'
            }`}
          />
        </div>
      </div>
      

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
            <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No chats found.
            </div>
        )}

        {filtered.map(chat => (
          <ChatItem
            key={chat.id}
            chat={chat}
            // Use activeChat?.id to compare against the chat/group ID
            selected={activeChat?.id === chat.id} 
            onClick={() => handleSelectChat(chat)}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
}