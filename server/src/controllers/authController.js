import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Group from "../models/Group.js"; 
import bcrypt from "bcryptjs"; 

// Helper function to generate JWT token (assuming this logic exists elsewhere too)
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// --- AUTHENTICATION FUNCTIONS ---

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Assuming password hashing logic is available
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Please provide email and password" });

    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Assuming password comparison logic is available
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// --- CHAT LIST FUNCTION (Fix for the SyntaxError) ---

export const getAllUsersAndGroups = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // 1. Fetch all other users (for DMs)
    const users = await User.find({ _id: { $ne: currentUserId } }).select("_id name email");
    
    // 2. Fetch all groups the current user is a member of
    const groups = await Group.find({ members: currentUserId })
      .populate("latestMessage")
      .populate("admin", "name email"); 
    
    // 3. Combine and return
    res.json({ users, groups });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching chat list", error: error.message });
  }
};