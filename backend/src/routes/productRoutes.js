import express from "express";
import {
  getProducts,
  getProductById,
  searchProducts
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);

export default router;