import express from "express";
import { registerUser, loginUser, getAllUsersAndGroups } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/chats", protect, getAllUsersAndGroups);


router.get("/users", protect, getAllUsersAndGroups);

export default router;