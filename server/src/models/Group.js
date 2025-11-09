import mongoose from "mongoose";

const GroupSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    // The user who created the group and has administrative privileges
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Used to show the last message in the chat list without searching the Message collection
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", GroupSchema);
export default Group;