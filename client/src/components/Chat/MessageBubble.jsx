import React from 'react';
import { MoreVertical, Download } from 'lucide-react';

export default function MessageBubble({ message, darkMode, showDate }) {
  return (
    <>
      {showDate && (
        <div className="flex items-center justify-center my-4">
          <span className={`px-4 py-1 rounded-full text-xs font-medium ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
          }`}>
            Today
          </span>
        </div>
      )}

      <div className={`flex ${message.isMine ? 'justify-end' : 'justify-start'} group`}>
        <div className={`max-w-md ${message.isMine ? 'order-2' : 'order-1'}`}>
          <div className="flex items-end gap-2">
            <div className="relative">
              {message.image && (
                <div className={`rounded-2xl p-2 ${message.isMine ? 'bg-orange-500' : darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm mb-1`}>
                  <div className="w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Image Preview</span>
                  </div>
                  <p className={`mt-2 ${message.isMine ? 'text-white' : darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {message.text}
                  </p>
                </div>
              )}

              {message.file && (
                <div className={`rounded-2xl p-4 ${message.isMine ? 'bg-orange-500' : darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm flex items-center gap-3`}>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                    <svg className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${message.isMine ? 'text-white' : darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {message.file}
                    </p>
                  </div>
                  <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
                    <Download className={`w-5 h-5 ${message.isMine ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>
                </div>
              )}

              {message.text && !message.image && !message.file && (
                <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                  message.isMine
                    ? 'bg-orange-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-gray-800'
                }`}>
                  <p>{message.text}</p>
                </div>
              )}
            </div>

            <button className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}>
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
