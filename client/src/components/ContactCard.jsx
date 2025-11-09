import React from "react";
import { User, MessageSquare } from 'lucide-react';

export default function ContactCard({ contact, darkMode, onSelectContact }) {
  // Use a sensible default for onSelectContact if it's missing, to prevent crashes
  const handleSelect = () => {
    if (onSelectContact) {
      onSelectContact(contact);
    } else {
      console.warn('onSelectContact handler not provided to ContactCard');
    }
  };

  return (
    <div
      className={`rounded-xl shadow-lg p-5 flex flex-col items-center gap-3 transition-all transform hover:scale-[1.02] ${
        darkMode ? "bg-gray-800 border border-gray-700 hover:border-orange-500" : "bg-white border border-gray-200 hover:border-orange-500"
      }`}
    >
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold flex-shrink-0">
          {contact.avatar}
        </div>
        {/* Mock Online status */}
        {contact.status === "online" && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
        )}
      </div>

      <div>
        <h3 className={`font-bold text-lg text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
          {contact.name}
        </h3>
        <p className={`text-sm text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {contact.email}
        </p>
      </div>

      <button
        onClick={handleSelect}
        className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        Start Chat
      </button>
    </div>
  );
}
