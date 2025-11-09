import React from 'react';
import { Moon, Sun, Bell, Lock, Palette, Globe, HelpCircle, LogOut } from 'lucide-react';
import SettingsItem from './UI/SettingsItem';

export default function SettingsPage({ darkMode, onToggleDarkMode }) {
  return (
    <div className={`flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`px-6 py-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className={`text-sm font-semibold mb-3 px-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Appearance</h2>
            <div className={`rounded-2xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div
                onClick={onToggleDarkMode}
                className={`px-6 py-4 flex items-center justify-between cursor-pointer transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {darkMode ? (
                      <Moon className="w-5 h-5 text-orange-400" />
                    ) : (
                      <Sun className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Theme</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{darkMode ? 'Dark mode enabled' : 'Light mode enabled'}</p>
                  </div>
                </div>

                <button
                  className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-orange-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'transform translate-x-6' : ''}`}></div>
                </button>
              </div>
            </div>
          </div>

          <div>
            <h2 className={`text-sm font-semibold mb-3 px-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>General</h2>
            <div className={`rounded-2xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <SettingsItem icon={Bell} label="Notifications" description="Manage notification preferences" darkMode={darkMode} />
              <SettingsItem icon={Lock} label="Privacy & Security" description="Control your privacy settings" darkMode={darkMode} hasBorder />
              <SettingsItem icon={Palette} label="Chat Background" description="Customize chat appearance" darkMode={darkMode} hasBorder />
              <SettingsItem icon={Globe} label="Language" description="English (US)" darkMode={darkMode} hasBorder />
              <SettingsItem icon={HelpCircle} label="Help & Support" description="Get help and contact support" darkMode={darkMode} hasBorder />
            </div>
          </div>

          <button className="w-full px-6 py-4 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-3">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
