import express from "express";
import { 
  createGroup, 
  addUserToGroup, 
  removeUserFromGroup 
} from "../controllers/groupController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createGroup); // Create a new group
router.put("/:groupId/add", protect, addUserToGroup); // Add member (Admin only)
router.put("/:groupId/remove", protect, removeUserFromGroup); // Remove member (Admin only)

export default router;