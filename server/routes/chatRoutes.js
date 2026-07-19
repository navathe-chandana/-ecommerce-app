import express from "express";
import { chatWithSupport } from "../controllers/chatController.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Optional auth - works whether logged in or not, but attaches user if token exists
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      // Invalid token, just proceed without user
    }
  }
  next();
};

router.post("/", optionalAuth, chatWithSupport);

export default router;