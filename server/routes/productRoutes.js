import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();
const upload = multer({ storage });

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protect, admin, upload.array("images", 5), createProduct);
router.put("/:id", protect, admin, upload.array("images", 5), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;