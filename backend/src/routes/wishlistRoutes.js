import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from "../controllers/wishlistController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getWishlist);
router.post("/add", requireAuth, addToWishlist);
router.delete("/:id", requireAuth, removeFromWishlist);

export default router;