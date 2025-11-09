import Group from "../models/Group.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Helper function to check if the user is the admin
const checkAdmin = async (groupId, userId, res) => {
  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404).json({ message: "Group not found" });
    return false;
  }
  if (group.admin.toString() !== userId.toString()) {
    res.status(403).json({ message: "Only the group administrator can perform this action" });
    return false;
  }
  return group;
};

// POST /api/groups
export const createGroup = async (req, res) => {
  try {
    const { name, memberIds } = req.body;
    const currentUserId = req.user._id;

    if (!name || !memberIds || memberIds.length === 0) {
      return res.status(400).json({ message: "Group name and members are required" });
    }

    // Ensure the creator (admin) is included in the members list
    const finalMembers = new Set([...memberIds.map(id => id.toString()), currentUserId.toString()]);
    
    // Create the group
    const group = await Group.create({
      name,
      members: Array.from(finalMembers),
      admin: currentUserId,
      latestMessage: null // Initialize without a message
    });

    // Notify users about the new group via socket (will be handled in server.js/socket logic)
    const io = req.app.get("io");
    group.members.forEach(memberId => {
        io.to(memberId.toString()).emit("groupUpdated", { type: 'NEW', group });
    });

    res.status(201).json(group);

  } catch (error) {
    res.status(500).json({ message: "Server error during group creation", error: error.message });
  }
};

// PUT /api/groups/:groupId/add
export const addUserToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userIdToAdd } = req.body; // The ID of the user to be added
    const currentUserId = req.user._id;

    const group = await checkAdmin(groupId, currentUserId, res);
    if (!group) return;

    if (group.members.includes(userIdToAdd)) {
        return res.status(400).json({ message: "User is already a member of the group." });
    }
    
    group.members.push(userIdToAdd);
    await group.save();

    // Notify the added user and all existing members
    const io = req.app.get("io");
    group.members.forEach(memberId => {
        io.to(memberId.toString()).emit("groupUpdated", { type: 'MEMBER_ADDED', group });
    });
    
    res.json({ message: "User added successfully", group });
  } catch (error) {
    res.status(500).json({ message: "Server error adding user to group", error: error.message });
  }
};

// PUT /api/groups/:groupId/remove
export const removeUserFromGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userIdToRemove } = req.body; // The ID of the user to be removed
    const currentUserId = req.user._id;

    const group = await checkAdmin(groupId, currentUserId, res);
    if (!group) return;
    
    if (userIdToRemove === currentUserId.toString()) {
         return res.status(400).json({ message: "Admin cannot remove themselves from the group." });
    }

    const initialLength = group.members.length;
    group.members = group.members.filter(member => member.toString() !== userIdToRemove);

    if (group.members.length === initialLength) {
        return res.status(404).json({ message: "User not found in group." });
    }
    
    await group.save();
    
    // Notify the removed user and all remaining members
    const io = req.app.get("io");
    io.to(userIdToRemove).emit("groupUpdated", { type: 'REMOVED', groupId });
    group.members.forEach(memberId => {
        io.to(memberId.toString()).emit("groupUpdated", { type: 'MEMBER_REMOVED', group });
    });

    res.json({ message: "User removed successfully", group });
  } catch (error) {
    res.status(500).json({ message: "Server error removing user from group", error: error.message });
  }
};