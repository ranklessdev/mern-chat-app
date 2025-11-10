import { useAuth, AuthProvider } from "../context/AuthContext.jsx"; 
import Login from "./Login.jsx";
import ChatPage from "./Chat.jsx"; 
import '../index.css';

const AppContent = () => {
  const { user } = useAuth();  
  if (!user) {
    return <Login />;
  }
  return <ChatPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
