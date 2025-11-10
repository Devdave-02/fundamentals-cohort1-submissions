import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { auth, authorize } from "../middleware/authMiddleware";
import { UserRoles } from "../utilities/enums/UserRole";

const router = express.Router();

router.post("/", auth, authorize(UserRoles.Admin, UserRoles.Entrepreneur), createProduct);
router.get("/", auth, getProducts);
router.get("/:id", auth, getProductById);
router.put("/:id", auth, authorize(UserRoles.Admin, UserRoles.Entrepreneur), updateProduct);
router.delete("/:id", auth, authorize(UserRoles.Admin, UserRoles.Entrepreneur), deleteProduct);

export default router;
