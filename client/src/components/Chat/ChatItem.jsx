import React from "react";

export default function ChatItem({ chat, selected, onClick, darkMode }) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 flex items-center gap-3 cursor-pointer border-b transition-colors ${
        selected
          ? darkMode
            ? "bg-gray-700 border-gray-600"
            : "bg-orange-50 border-orange-100"
          : darkMode
          ? "hover:bg-gray-700 border-gray-700"
          : "hover:bg-gray-50 border-gray-200"
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
          {chat.avatar || chat.name.charAt(0)}
        </div>
        {chat.status === "online" && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`font-semibold truncate ${darkMode ? "text-white" : "text-gray-800"}`}>
            {chat.name}
          </h3>
          <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {chat.time}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className={`text-sm truncate ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {chat.lastMessage}
          </p>
          {chat.unread > 0 && (
            <span className="ml-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
