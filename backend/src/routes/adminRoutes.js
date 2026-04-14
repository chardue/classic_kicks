import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import {
  getDashboardSummary,
  getProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrdersAdmin,
  updateOrderStatus,
  getBestSellerReport,
  getWishlistAlerts,
  getAdmins,
  createAdminUser,
  deleteAdminUser
} from "../controllers/adminController.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/dashboard/summary", getDashboardSummary);
router.get("/dashboard/orders", getOrdersAdmin);
router.get("/dashboard/best-sellers", getBestSellerReport);
router.get("/dashboard/wishlist-alerts", getWishlistAlerts);

router.get("/products", getProductsAdmin);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.patch("/orders/:id/status", updateOrderStatus);

router.get("/admins", getAdmins);
router.post("/admins", createAdminUser);
router.delete("/admins/:id", deleteAdminUser);

export default router;