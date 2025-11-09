import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../hooks/useSocket";
import UserList from "../components/UserList"; 
import ChatWindow from "../components/Chat/ChatWindow"; 
import SettingsPage from "../components/SettingsPage";
import ProfilePage from "../components/ProfilePage";
import ContactList from "../components/ContactList";
import ChatListPanel from "../components/Chat/ChatListPanel"; 
import CreateGroupModal from "../components/UI/CreateGroupModal"; 
import ManageGroupMembersModal from "../components/UI/ManageGroupMembersModal"; 
import API from "../api/api"; 

// Helper: Sort chats by recent activity
const sortByTime = (a, b) => {
    const timeA = a.lastActivityTime ? new Date(a.lastActivityTime) : 0;
    const timeB = b.lastActivityTime ? new Date(b.lastActivityTime) : 0;
    return timeB - timeA;
};

// Helper: Standardize chat objects
const mapToChatItem = (item, isGroup) => {
    if (isGroup) {
        const adminId = item.admin ? item.admin._id : (item.admin || null); 
        
        return {
            id: item._id,
            name: item.name,
            avatar: item.name?.charAt(0).toUpperCase() || 'G',
            status: 'group',
            chatType: 'GROUP', 
            latestMessage: item.latestMessage?.content || 'New group created.',
            time: item.latestMessage ? new Date(item.latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            members: item.members.length,
            adminId: adminId, 
            backendData: item,
            lastActivityTime: item.latestMessage?.createdAt || item.updatedAt, 
        };
    } else {
        return {
            id: item._id,
            name: item.name || item.email,
            avatar: (item.name || item.email)?.charAt(0).toUpperCase(),
            status: 'online', 
            chatType: 'DM', 
            latestMessage: 'Start a conversation.', 
            time: '',
            unread: 0,
            backendData: item,
            lastActivityTime: item.updatedAt, 
        };
    }
};


export default function ChatPage() {
    const { user, logout } = useAuth();
    const currentUserId = user?._id;
    const socket = useSocket(currentUserId);
    
    const [activeChat, setActiveChat] = useState(() => {
      const savedChat = localStorage.getItem('activeChat');
      return savedChat ? JSON.parse(savedChat) : null;
    }); 
    
    const [activeView, setActiveView] = useState("chats");
    const [darkMode, setDarkMode] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    
    const [manageGroupModal, setManageGroupModal] = useState({
        isVisible: false,
        mode: null,
    });

    const [chats, setChats] = useState([]); 
    const [contacts, setContacts] = useState([]); 
    
    // --- Persistence & Fetching Hooks ---
    useEffect(() => {
        if (activeChat) localStorage.setItem('activeChat', JSON.stringify(activeChat));
        else localStorage.removeItem('activeChat');
    }, [activeChat]);

    useEffect(() => {
        const fetchChatsAndContacts = async () => {
            try {
                const res = await API.get("/auth/chats"); 
                const { users, groups } = res.data;

                const mappedContacts = users.map(u => ({
                    id: u._id, name: u.name || u.email, email: u.email, avatar: (u.name || u.email)?.charAt(0).toUpperCase(), status: "online", backendData: u, 
                }));
                setContacts(mappedContacts);
                
                const mappedDMs = users.map(u => mapToChatItem(u, false));
                const mappedGroups = groups.map(g => mapToChatItem(g, true));
                
                const combinedChats = [...mappedGroups, ...mappedDMs]; 
                setChats(combinedChats.sort(sortByTime));

            } catch (err) {
                console.error("Failed to fetch chats and contacts:", err);
            }
        };
        if (user) fetchChatsAndContacts();
    }, [user]);

    const handleGroupCreated = useCallback((newGroupData) => {
        const newChatItem = mapToChatItem(newGroupData, true);
        setChats(prev => [newChatItem, ...prev].sort(sortByTime));
        setActiveChat(newChatItem);
        setShowGroupModal(false);
    }, []);

    const handleSelectChat = useCallback((chat) => {
        setActiveChat(chat);
        setActiveView("chats");
    }, []);

    const handleOpenManageModal = (mode) => {
        setManageGroupModal({ isVisible: true, mode: mode });
    };

    // --- Socket Listener (Handles chat updates and re-sorting) ---
    useEffect(() => {
        if (!socket || !currentUserId) return; 

        const handleGroupUpdate = (data) => {
            const { type, group, groupId } = data;

            if (type === 'NEW' || type === 'MEMBER_ADDED' || type === 'MEMBER_REMOVED') {
                const updatedChatItem = mapToChatItem(group, true); 
                
                setChats(prevChats => {
                    const updatedList = prevChats.filter(c => c.id !== updatedChatItem.id);
                    return [updatedChatItem, ...updatedList].sort(sortByTime);
                });
                
                // CRITICAL FIX: FULL replacement of activeChat to fix Admin button state
                setActiveChat(prevActive => {
                    if (prevActive?.id === updatedChatItem.id) {
                        return updatedChatItem;
                    }
                    return prevActive;
                });
            
            } else if (type === 'REMOVED' && groupId) {
                setChats(prevChats => prevChats.filter(c => c.id !== groupId));
                setActiveChat(prevActive => prevActive?.id === groupId ? null : prevActive);
                alert(`You have been removed from a group.`);
            }
        };
        
        const handleMessageReceived = (msg) => {
            setChats(prevChats => {
                const relevantChatId = msg.chatType === 'DM' 
                    ? (msg.senderId === currentUserId ? msg.chatId : msg.senderId) 
                    : msg.chatId;

                const chatToUpdate = prevChats.find(c => c.id === relevantChatId);

                if (chatToUpdate) {
                    // Create a new updated chat object
                    const updatedChat = {
                        ...chatToUpdate,
                        latestMessage: msg.content,
                        lastActivityTime: msg.createdAt, 
                        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        backendData: {
                            ...chatToUpdate.backendData,
                            latestMessage: { content: msg.content, createdAt: msg.createdAt }
                        }
                    };
                    const otherChats = prevChats.filter(c => c.id !== relevantChatId);
                    // FIX: Return the newly sorted array (full replacement)
                    return [updatedChat, ...otherChats].sort(sortByTime); 
                }
                return prevChats;
            });
        };

        socket.on("groupUpdated", handleGroupUpdate);
        socket.on("messageReceived", handleMessageReceived);

        return () => {
            socket.off("groupUpdated", handleGroupUpdate);
            socket.off("messageReceived", handleMessageReceived);
        };
    }, [socket, currentUserId, setActiveChat]); 
    

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    }, [darkMode]);


    const renderMainContent = () => {
      switch (activeView) {
        case "chats":
          return (
            <>
              <ChatListPanel
                chats={chats} 
                activeChat={activeChat} 
                onSelectChat={handleSelectChat}
                darkMode={darkMode}
                onOpenGroupModal={() => setShowGroupModal(true)} 
              />
              
              {activeChat ? (
                // Scrolling Fix is here: ChatWindow itself applies flex-1
                <ChatWindow 
                    activeChat={activeChat} 
                    darkMode={darkMode}
                    user={user}
                    socket={socket} 
                    onManageGroup={handleOpenManageModal} 
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
                  Select a chat or group to start messaging
                </div>
              )}
            </>
          );
        case "contacts":
          return <ContactList contacts={contacts} darkMode={darkMode} onSelectContact={handleSelectChat} />; 
        case "profile":
          return <ProfilePage currentUser={user} darkMode={darkMode} />;
        case "settings":
          return (
            <SettingsPage
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
            />
          );
        default:
          return (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
              Welcome to the Chat App. Select a view from the sidebar.
            </div>
          );
      }
    };

    return (
      <div
        className={`flex h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <UserList
          currentUserId={currentUserId}
          activeView={activeView}
          setActiveView={setActiveView}
          darkMode={darkMode}
          onLogout={logout}
          contacts={contacts} 
          onSelectUser={handleSelectChat}
        />

        <div className="flex flex-1">
          {renderMainContent()}
        </div>

        {/* Group Creation Modal */}
        {showGroupModal && (
          <CreateGroupModal
            contacts={contacts} 
            darkMode={darkMode}
            onClose={() => setShowGroupModal(false)}
            onGroupCreated={handleGroupCreated} 
          />
        )}
        
        {/* Manage Group Members Modal */}
        {manageGroupModal.isVisible && activeChat?.chatType === "GROUP" && (
            <ManageGroupMembersModal
                mode={manageGroupModal.mode} 
                activeChat={activeChat}
                contacts={contacts} 
                darkMode={darkMode}
                onClose={() => setManageGroupModal({ isVisible: false, mode: null })}
            />
        )}
      </div>
    );
}