import { Router } from "express";
import { authenticate } from "@/middleware/authentication";
import { body } from "express-validator";
import { validationError } from "@/middleware/validation";
import { addToCart } from "@/controllers/v1/cart/add_to_cart";
import { getAllCartItems } from "@/controllers/v1/cart/getall_item";
import { getCartLength } from "@/controllers/v1/cart/get_cart_length";
import { Cart } from "@/models/cart";

const router = Router();

router.post(
  "/add-to-cart",
  authenticate,
  body("productId").notEmpty().withMessage("Product ID is required"),
  body("quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be a positive integer"),
  validationError,
  addToCart
);

router.get("/get-cart/:userId", authenticate, getAllCartItems);
router.get("/get-cart-item-length/:userId", authenticate, getCartLength);

export { router as cartRouter };
