import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCart, addToCart, removeFromCart, syncCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.post("/sync", protect, syncCart);
router.delete("/:productId", protect, removeFromCart);

export default router;