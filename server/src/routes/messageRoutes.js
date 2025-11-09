import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendMessage);

// Use query parameters for type, and a single parameter for ID, since ID could be User ID or Group ID
router.get("/", protect, getMessages); 

export default router;