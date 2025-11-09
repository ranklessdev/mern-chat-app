import React from 'react';
import { Edit2, User, Mail, Phone, MapPin } from 'lucide-react';

export default function ProfilePage({ currentUser, darkMode }) {
  return (
    <div className={`flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`px-6 py-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className={`rounded-2xl p-8 text-center border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {currentUser.avatar}
              </div>
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
            </div>

            <h2 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{currentUser.name}</h2>
            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{currentUser.email}</p>

            <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 mx-auto">
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Account Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <div className="flex-1">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full Name</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{currentUser.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <div className="flex-1">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{currentUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <div className="flex-1">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>+91 123456789</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <div className="flex-1">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Location</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>New Delhi, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
