// import mongoose from 'mongoose';

// const messageSchema = mongoose.Schema(
//   {
//     senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     content: { type: String, required: true },
//     status: { type: String, enum: ["sent", "delivered", "seen"], default: "sent" }
//   },
//   { timestamps: true }
// );

// export default mongoose.model('Message', messageSchema);


import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Change receiverId to chatId. This ID can be either a User ID (for DM) or a Group ID.
    chatId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    content: { type: String, required: true },
    // Type helps us know if it's a direct message or a group message
    chatType: { type: String, enum: ["DM", "GROUP"], required: true },
    status: { type: String, enum: ["sent", "delivered", "seen"], default: "sent" }
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);