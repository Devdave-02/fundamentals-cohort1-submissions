import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./product.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", authenticate, createProduct);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
