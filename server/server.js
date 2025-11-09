// import http from "http";
// import { Server } from "socket.io";
// import app from "./src/app.js";
// import Message from "./src/models/Message.js";

// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// app.set("io", io);

// io.on("connection", (socket) => {
//   console.log("🟢 New client connected:", socket.id);

//   socket.on("join", (userId) => {
//     socket.join(userId);
//     console.log(`👤 User ${userId} joined their private room`);
//   });

//   // Handle sending messages through Socket.io
//   socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
//     const message = await Message.create({ senderId, receiverId, content });

//     // Send message to sender and receiver rooms only
//     io.to(senderId).emit("messageReceived", message);
//     io.to(receiverId).emit("messageReceived", message);
//   });

//   socket.on("disconnect", () => {
//     console.log("🔴 Client disconnected:", socket.id);
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// import http from "http";
// import { Server } from "socket.io";
// import app from "./src/app.js";
// import Message from "./src/models/Message.js"; // Required by Mongoose

// const server = http.createServer(app);
// // NOTE: Using cors: { origin: "*" } to allow frontend connection
// const io = new Server(server, { cors: { origin: "*" } });

// // Attach io instance to the express app so controllers can access it 
// app.set("io", io);

// io.on("connection", (socket) => {
//   console.log("🟢 New client connected:", socket.id);

//   // CRITICAL: The frontend emits 'join' with the user's ID to join their private room
//   socket.on("join", (userId) => { 
//     // The room name is the user's unique ID
//     socket.join(userId);
//     console.log(`👤 User ${userId} joined their private room`);
//   });

//   // CRITICAL: Handle the generic 'sendMessage' event from the client
//   // The logic for saving and broadcasting to DMs or Groups is handled in messageController.js
//   socket.on("sendMessage", async (messageData) => {
//     // The message controller will handle saving and broadcasting to all relevant rooms.
//     // The backend's logic handles emitting 'messageReceived' back to the sender and receiver(s).
//   });

//   socket.on("disconnect", () => {
//     console.log("🔴 Client disconnected:", socket.id);
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));





import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import app from "./src/app.js";
import Message from "./src/models/Message.js";

dotenv.config();

// ✅ 1. Create HTTP server
const server = http.createServer(app);

// ✅ 2. CORS setup for Socket.io
const allowedOrigins = [
  "http://localhost:3000", // for local dev
  process.env.CLIENT_URL, // 🔴 REPLACE this with your Netlify domain
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ✅ 3. Add CORS middleware for Express routes
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ 4. Attach io to app (for use inside controllers)
app.set("io", io);

// ✅ 5. Socket.io connection logic
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined their private room`);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
    try {
      const message = await Message.create({ senderId, receiverId, content });

      io.to(senderId).emit("messageReceived", message);
      io.to(receiverId).emit("messageReceived", message);
    } catch (error) {
      console.error("❌ Error saving message:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// ✅ 6. Simple test route (to check connection)
app.get("/ping", (req, res) => {
  res.json({ message: "✅ Backend is live!" });
});

// ✅ 7. Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
