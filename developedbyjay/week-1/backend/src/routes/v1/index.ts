import { Router } from "express";
import { authRouter } from "./auth";
import { cartRouter } from "./cart";
import { productRouter } from "./product";
import { userRouter } from "./user";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/cart", cartRouter);
router.use("/products", productRouter);

export default router;
