import express from "express";
import {
  getCart,
  addToCart,
  updateCartQuantity,
  deleteCartItem
} from "../controllers/cartController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getCart);
router.post("/add", requireAuth, addToCart);
router.patch("/item/:id", requireAuth, updateCartQuantity);
router.delete("/item/:id", requireAuth, deleteCartItem);

export default router;