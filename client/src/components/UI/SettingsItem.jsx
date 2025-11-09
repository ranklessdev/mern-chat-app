import React from 'react';

export default function SettingsItem({ icon: Icon, label, description, darkMode, hasBorder }) {
  return (
    <div
      className={`px-6 py-4 flex items-center justify-between cursor-pointer transition-colors ${
        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
      } ${hasBorder ? `border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}` : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <Icon className={`w-5 h-5 ${darkMode ? 'text-orange-400' : 'text-orange-500'}`} />
        </div>
        <div>
          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{label}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
        </div>
      </div>
      <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}
