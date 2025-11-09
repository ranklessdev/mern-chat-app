import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ContactCard from './ContactCard'; // Path relative to src/components/

export default function ContactList({ contacts, darkMode, onSelectContact }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`px-6 py-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>All Users (Contacts)</h1>

        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              darkMode
                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                : 'bg-gray-100 text-gray-800 placeholder-gray-500 border-gray-200'
            }`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {filteredContacts.length === 0 ? (
          <p className={`text-center mt-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No users found matching "{searchQuery}".
          </p>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                darkMode={darkMode}
                onSelectContact={onSelectContact}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
