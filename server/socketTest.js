import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// This test will act as User B
const USER_B_ID = "68eb67ba15a2244eac3819a5";

socket.on("connect", () => {
  console.log("✅ Connected to Socket.io server");
  socket.emit("join", USER_B_ID);
});

socket.on("messageReceived", (message) => {
  console.log("📩 Private message received:", message);
});
