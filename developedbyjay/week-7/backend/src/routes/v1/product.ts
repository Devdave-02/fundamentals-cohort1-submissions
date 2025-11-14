import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "@/middleware/authentication";
import { validationError } from "@/middleware/validation";
import { createProduct } from "@/controllers/v1/product/create-product";
import { getAllProducts } from "@/controllers/v1/product/getall-product";

const router = Router();

router.post(
  "/create_product",
  authenticate,
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a number greater than 0"),
  body("image")
    .optional()
    .notEmpty()
    .withMessage("Image URL is required")
    .isURL()
    .withMessage("Image must be a valid URL"),
  validationError,
  createProduct
);

router.get("/get-all-products", authenticate, getAllProducts);

export { router as productRouter };
