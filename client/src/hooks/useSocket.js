// src/hooks/useSocket.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;

    // ✅ Auto-detect correct backend URL (Render)
    const backendURL =
      import.meta.env.VITE_API_URL || "https://mern-chat-app-xuja.onrender.com";

    // ✅ Connect Socket.io with credentials
    const newSocket = io(backendURL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    // ✅ Join private room
    newSocket.on("connect", () => {
      console.log("🟢 Socket connected:", newSocket.id);
      newSocket.emit("join", userId);
    });

    newSocket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return socket;
};
