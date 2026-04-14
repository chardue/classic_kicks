import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from "../controllers/addressController.js";

const router = express.Router();

router.get("/", requireAuth, getAddresses);
router.post("/", requireAuth, addAddress);
router.put("/:id", requireAuth, updateAddress);
router.delete("/:id", requireAuth, deleteAddress);

export default router;