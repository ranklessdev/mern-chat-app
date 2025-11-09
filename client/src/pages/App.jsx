import { useAuth, AuthProvider } from "../context/AuthContext.jsx"; // FIXED: Added .jsx extension
import Login from "./Login.jsx"; // FIXED: Added .jsx extension
import ChatPage from "./Chat.jsx"; // FIXED: Added .jsx extension

// Import Tailwind CSS file for styling
import '../index.css'; // FIXED: Changed to single '../' (App.jsx is one level deep from index.css)

const AppContent = () => {
  // Assuming useAuth() is defined in AuthContext.jsx and exported as useAuth
  const { user } = useAuth();
  
  // NOTE: Your backend only supports direct 1-to-1 chat, not groups, 
  // so the new components will be adapted to that model.
  
  // If user is not authenticated, show the new styled Login screen
  if (!user) {
    return <Login />;
  }

  // If authenticated, show the main Chat Application UI
  return <ChatPage />;
};

// Root wrapper (AuthProvider remains here)
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
