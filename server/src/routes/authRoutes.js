import express from "express";
import { registerUser, loginUser, getAllUsersAndGroups } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Unified route to fetch all chat partners (users and groups)
router.get("/chats", protect, getAllUsersAndGroups);

// Route to fetch users for group member selection (kept separate for clarity)
router.get("/users", protect, getAllUsersAndGroups); // Reuse controller for simplicity

export default router;