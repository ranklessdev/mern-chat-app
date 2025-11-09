import React, { useState } from "react";
import LeftSidebar from "./UI/LeftSidebar"; 

export default function UserList({ currentUserId, onSelectUser, activeView, setActiveView, darkMode, onLogout, contacts = [] }) {
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const currentUser = { id: currentUserId, avatar: 'U' }; 

  // This component no longer fetches data. It relies on ChatPage to pass it via props.

  // Only show the sidebar component, which handles navigation and contact dropdown
  return (
    <LeftSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onViewChange={setActiveView}
        onLogout={onLogout} // Pass the logout handler down
        // CRITICAL: New prop to open the group modal
        onCreateGroup={() => setShowContactDropdown(true)} 
        darkMode={darkMode}
        currentUser={currentUser}
        contacts={contacts} // Pass fetched users as quick contacts
        showContactDropdown={showContactDropdown}
        setShowContactDropdown={setShowContactDropdown}
        // onSelectContact handler passed down to the sidebar's contact dropdown
        onSelectContact={(contact) => {
            // Note: The contact object here is the mapped object from Chat.jsx
            onSelectUser(contact);
            setActiveView("chats");
        }}
    />
  );
}