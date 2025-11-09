import { createContext, useContext, useState, useEffect } from "react";
import { setAuthToken } from "../api/api"; // <-- CORRECTED PATH

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    const token = localStorage.getItem("token"); // Assuming you store the token separately
    if (saved && token) {
        setAuthToken(token);
        return JSON.parse(saved);
    }
    return null;
  });

  // Ensure AuthToken is set globally whenever the user state changes
  useEffect(() => {
    if (user) {
        const token = localStorage.getItem("token");
        if (token) {
            setAuthToken(token);
        }
    } else {
        setAuthToken(null);
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // Store the token separately as per MERN standard practices
    if (userData.token) {
        localStorage.setItem("token", userData.token);
        setAuthToken(userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuthToken(null); // Clear token from axios defaults
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
