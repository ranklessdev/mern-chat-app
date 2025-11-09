import React from "react";
import { MessageCircle, Users, Settings, User, Plus, LogOut } from "lucide-react";

export default function LeftSidebar({
  activeView,
  setActiveView,
  onCreateGroup, // Currently prints a console message
  darkMode,
  currentUser, // e.g., { id: '...', name: 'Sachin', avatar: 'S' }
  contacts = [], // Used for the quick contact dropdown
  showContactDropdown,
  setShowContactDropdown,
  onSelectContact, // Handler for selecting a quick contact
  onLogout, // Handler for logging out
}) {
  const navItems = [
    { id: "chats", icon: MessageCircle, label: "Chats" },
    { id: "contacts", icon: Users, label: "Contacts" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div
      className={`${
        showContactDropdown ? "w-80" : "w-20"
      } transition-all duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border-r flex flex-col items-center py-4 h-screen flex-shrink-0`}
    >
      {/* Logo */}
      <div 
        className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-6 cursor-pointer flex-shrink-0 shadow-lg"
        onClick={() => setActiveView("chats")}
        title="Go to Chats"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </div>

      {/* Navigation Icons */}
      <div className="flex-1 space-y-4 flex flex-col items-center w-full overflow-hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveView(item.id);
              setShowContactDropdown(false);
            }}
            title={item.label}
            className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center transition-all ${
              activeView === item.id
                ? "bg-orange-500 text-white shadow-lg"
                : darkMode
                ? "text-gray-400 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}

        {/* Create Group/Dropdown Toggle Button */}
        <button
          onClick={() => setShowContactDropdown(!showContactDropdown)}
          title="Quick Contacts"
          className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center transition-all ${
            showContactDropdown
              ? "bg-orange-500 text-white shadow-lg"
              : darkMode
              ? "text-gray-400 hover:bg-gray-700 border border-gray-700"
              : "text-gray-600 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          <Plus
            className={`w-6 h-6 transition-transform ${
              showContactDropdown ? "rotate-45" : ""
            }`}
          />
        </button>

        {/* Contact Dropdown Panel */}
        {showContactDropdown && (
          <div className="w-full px-4 flex-1 overflow-y-auto">
            <div
              className={`mb-3 text-sm font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Quick Contacts
            </div>
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    onSelectContact?.(contact);
                    setShowContactDropdown(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {contact.avatar}
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 w-2 h-2 ${
                        contact.status === "online"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      } rounded-full border ${
                        darkMode ? "border-gray-800" : "border-white"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {contact.name}
                    </p>
                    <p
                      className={`text-xs truncate ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {contact.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Divider */}
      <div className={`w-1/2 h-px mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />

      {/* Logout Button (below divider) */}
      <button
        onClick={onLogout}
        title="Logout"
        className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center transition-all mb-4 ${
          darkMode
            ? "text-red-400 hover:bg-gray-700"
            : "text-red-500 hover:bg-gray-100"
        }`}
      >
        <LogOut className="w-6 h-6" />
      </button>

      {/* User Avatar (bottom) */}
      <div 
        className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer shadow-md"
        title={`Logged in as ${currentUser?.name || 'User'}`}
        onClick={() => setActiveView("profile")}
      >
        {currentUser?.avatar || "U"}
      </div>
    </div>
  );
}
