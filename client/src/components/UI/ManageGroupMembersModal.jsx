import React, { useState, useMemo } from 'react';
import { X, Loader2 } from 'lucide-react';
import API from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export default function ManageGroupMembersModal({ 
  mode, // 'add' or 'remove'
  activeChat, 
  contacts, // Full list of all available users (for selection)
  onClose, 
  darkMode 
}) {
  const { user } = useAuth();
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine the list of users to display based on the mode
  const displayUsers = useMemo(() => {
    if (!activeChat) return [];

    const currentMemberIds = activeChat.backendData.members || [];
    const adminId = activeChat.adminId;

    if (mode === 'add') {
      return contacts.filter(contact => !currentMemberIds.includes(contact.id));
    } else if (mode === 'remove') {
      return contacts.filter(contact => 
        currentMemberIds.includes(contact.id) && 
        contact.id !== adminId && 
        contact.id !== user._id 
      );
    }
    return [];
  }, [mode, activeChat, contacts, user._id]);

  const toggleSelection = (id) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setError(null);
    if (selectedUserIds.length === 0) {
      setError(`Please select at least one user to ${mode}.`);
      return;
    }

    setIsLoading(true);

    try {
      for (const userId of selectedUserIds) {
        const endpoint = `/groups/${activeChat.id}/${mode}`;
        
        const payload = mode === 'add' 
            ? { userIdToAdd: userId }
            : { userIdToRemove: userId };

        await API.put(endpoint, payload);
      }
      
      // FIX: Rely only on onClose(). The socket listener in ChatPage handles the UI update.
      onClose(); 

    } catch (err) {
      console.error(`${mode} member failed:`, err.response?.data?.message || err.message);
      setError(err.response?.data?.message || `Failed to ${mode} member. Check permissions.`);
    } finally {
      setIsLoading(false);
    }
  };

  const title = mode === 'add' ? `Add Members to ${activeChat.name}` : `Remove Members from ${activeChat.name}`;
  const actionLabel = mode === 'add' ? `Add (${selectedUserIds.length})` : `Remove (${selectedUserIds.length})`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`p-6 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
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

          <div className="space-y-2">
            {displayUsers.length === 0 ? (
                <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {mode === 'add' ? 'All available contacts are already in this group.' : 'No removable members found.'}
                </p>
            ) : (
                displayUsers.map(contact => (
                    <div key={contact.id} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {contact.avatar}
                        </div>
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{contact.name}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{contact.email}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(contact.id)}
                        onChange={() => toggleSelection(contact.id)}
                        className="w-5 h-5 text-orange-500 rounded"
                      />
                    </div>
                ))
            )}
          </div>
        </div>

        <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={handleSubmit} 
            disabled={isLoading || selectedUserIds.length === 0}
            className={`w-full bg-orange-500 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${isLoading || selectedUserIds.length === 0 ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600'}`}
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? 'Processing...' : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}