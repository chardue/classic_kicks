import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getAccount,
  updateAccount
} from "../controllers/accountController.js";

const router = express.Router();

router.get("/", requireAuth, getAccount);
router.put("/", requireAuth, updateAccount);

export default router;