import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;