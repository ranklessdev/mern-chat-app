import Message from "../models/Message.js";
import Group from "../models/Group.js";
import User from "../models/User.js";

const emitMessage = async (io, message) => {
    io.to(message.senderId.toString()).emit("messageReceived", message);

    if (message.chatType === 'DM') {

        if (message.chatId.toString() !== message.senderId.toString()) {
             io.to(message.chatId.toString()).emit("messageReceived", message);
        }

    } else if (message.chatType === 'GROUP') {

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
    const { chatId, content, chatType } = req.body; 
    const senderId = req.user._id;

    if (!chatId || !content || !chatType) {
        return res.status(400).json({ message: "Chat ID, content, and type are required." });
    }

    const message = await Message.create({
      senderId,
      chatId,
      content,
      chatType,
    });

    const io = req.app.get("io");
    
    await emitMessage(io, message);
    
    if (chatType === 'GROUP') {
        await Group.findByIdAndUpdate(chatId, { latestMessage: message._id });
    } else if (chatType === 'DM') {
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
         messages = await Message.find({
            $or: [
                { senderId: req.user._id, chatId: chatId }, 
                { senderId: chatId, chatId: req.user._id }, 
            ],
            chatType: 'DM'
        }).sort({ createdAt: 1 });


    } else if (chatType === 'GROUP') {
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