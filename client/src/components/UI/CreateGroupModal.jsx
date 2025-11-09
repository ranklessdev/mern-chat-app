import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react'; // Added Loader2 for loading state
import API from "../../api/api"; // Import the API instance

// CRITICAL: Added onGroupCreated prop
export default function CreateGroupModal({ contacts = [], onClose, darkMode, onGroupCreated }) { 
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateGroup = async () => {
    setError(null);

    if (!groupName.trim()) {
        setError('Group name is required.');
        return;
    }
    if (selectedMembers.length === 0) {
        setError('Please select at least one member.');
        return;
    }

    setIsLoading(true);

    // The backend expects an array of user IDs
    const memberIds = selectedMembers; 

    try {
        // API: POST /api/groups
        const res = await API.post('/groups', { 
            name: groupName.trim(), 
            memberIds: memberIds 
        });
        
        // Success: Call the handler passed from ChatPage with the new group data
        onGroupCreated(res.data); 

        // Clear local state and close the modal (handler does this, but added for safety)
        setGroupName('');
        setSelectedMembers([]);
        onClose(); 

    } catch (err) {
        console.error('Group creation failed:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Failed to create group. Server error.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`p-6 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Create New Group</h2>
          <button onClick={onClose} className={darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                darkMode
                  ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
                  : 'bg-white text-gray-800 border-gray-300 placeholder-gray-500'
              }`}
              placeholder="Enter group name"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Add Members</label>
            <div className="space-y-2">
              {contacts.map(contact => (
                <div key={contact.id} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {contact.avatar}
                    </div>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{contact.name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{contact.status}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    // IMPORTANT: We use contact.id (the User ID) for the selectedMembers array
                    checked={selectedMembers.includes(contact.id)}
                    onChange={() => {
                      setSelectedMembers(prev =>
                        prev.includes(contact.id)
                          ? prev.filter(id => id !== contact.id)
                          : [...prev, contact.id]
                      );
                    }}
                    className="w-5 h-5 text-orange-500 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={handleCreateGroup} // CRITICAL: Call the API function
            disabled={isLoading}
            className={`w-full bg-orange-500 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600'}`}
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? 'Creating Group...' : `Create Group (${selectedMembers.length} members)`}
          </button>
        </div>
      </div>
    </div>
  );
}