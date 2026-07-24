import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getAllUsers, toggleBlockUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, admin, getAllUsers);
router.put("/:id/toggle-block", protect, admin, toggleBlockUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;