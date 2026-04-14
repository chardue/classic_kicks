import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  placeOrder,
  getMyOrders,
  cancelOrder,
  getOrderTimeline
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/place", requireAuth, placeOrder);
router.get("/", requireAuth, getMyOrders);
router.patch("/:id/cancel", requireAuth, cancelOrder);
router.get("/:id/tracking", requireAuth, getOrderTimeline);

export default router;