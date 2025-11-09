import Message from "../models/Message.js";
import Group from "../models/Group.js";
import User from "../models/User.js";

// Helper function to handle socket emission to DMs or Groups
const emitMessage = async (io, message) => {
    // 1. Always send back to the sender
    io.to(message.senderId.toString()).emit("messageReceived", message);

    if (message.chatType === 'DM') {
        // CRITICAL FIX: The chatId IS the other user's ID in a DM. Send to that ID/room.
        // We only send to the chatId if it's not the sender to prevent double-sending, 
        // as the sender is already handled above.
        if (message.chatId.toString() !== message.senderId.toString()) {
             io.to(message.chatId.toString()).emit("messageReceived", message);
        }

    } else if (message.chatType === 'GROUP') {
        // Fetch group members and send to everyone except the sender
        // IMPORTANT: The message.chatId here is the Group ID.
        const group = await Group.findById(message.chatId).select('members');
        if (group) {
            group.members.forEach(memberId => {
                if (memberId.toString() !== message.senderId.toString()) {
                    // Emit to each member's private room
                    io.to(memberId.toString()).emit("messageReceived", message);
                }
            });
        }
    }
};


export const sendMessage = async (req, res) => {
  try {
    // Note: senderId is automatically available via req.user._id from the 'protect' middleware
    const { chatId, content, chatType } = req.body; 
    const senderId = req.user._id; // Get senderId from authenticated user

    if (!chatId || !content || !chatType) {
        return res.status(400).json({ message: "Chat ID, content, and type are required." });
    }

    // 1. Create and Save the Message
    const message = await Message.create({
      senderId,
      chatId, // Use chatId instead of receiverId
      content,
      chatType,
    });

    const io = req.app.get("io");
    
    // 2. Broadcast the Message
    await emitMessage(io, message);
    
    // 3. Update latest message on the associated chat/group
    if (chatType === 'GROUP') {
        await Group.findByIdAndUpdate(chatId, { latestMessage: message._id });
    } else if (chatType === 'DM') {
        // No latestMessage field on User model, but we should update the chat list view logic 
        // to handle the latest message correctly by fetching it or relying on the client state.
        // Since we don't have a dedicated DM model, we rely on the message history.
    }

    res.status(201).json(message);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { chatId, chatType } = req.query; 

    if (!chatId || !chatType) {
        return res.status(400).json({ message: "Chat ID and chat type are required." });
    }

    let messages;
    
    if (chatType === 'DM') {
        // Fix for DM query logic: We fetch messages where the sender/chatId match either pair.
         messages = await Message.find({
            $or: [
                // Sender is current user (req.user._id), Recipient is other user (chatId)
                { senderId: req.user._id, chatId: chatId }, 
                // Sender is other user (chatId), Recipient is current user (req.user._id)
                { senderId: chatId, chatId: req.user._id }, 
            ],
            chatType: 'DM'
        }).sort({ createdAt: 1 });


    } else if (chatType === 'GROUP') {
        // Fetch messages for a specific group ID
        messages = await Message.find({
            chatId: chatId,
            chatType: 'GROUP'
        }).sort({ createdAt: 1 });
        
    } else {
        return res.status(400).json({ message: "Invalid chat type provided." });
    }

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};