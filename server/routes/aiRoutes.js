import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { generateDescription } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate-description", protect, admin, generateDescription);

export default router;