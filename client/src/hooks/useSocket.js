import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// This URL is derived from your server.js (Port 5000)
const SOCKET_URL = "http://localhost:5000";

export const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
        return;
    }

    // Since your backend doesn't seem to pass a token during connection, 
    // it relies on the 'join' event after connection.
    const s = io(SOCKET_URL);
    
    s.on("connect", () => {
        console.log(`Socket connected. Joining room: ${userId}`);
        s.emit("join", userId); // Join event is critical for your backend
    });

    s.on("connect_error", (err) => {
        console.error("Socket Connection Error:", err.message);
    });

    setSocket(s);

    return () => {
        s.disconnect();
    };
  }, [userId]);

  return socket;
};
