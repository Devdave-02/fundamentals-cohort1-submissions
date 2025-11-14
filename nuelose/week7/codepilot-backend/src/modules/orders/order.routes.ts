import { Router } from "express";
import { orderController } from "./order.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, orderController.create);
router.get("/", authenticate, orderController.getAll);
router.get("/:id", authenticate, orderController.getById);

export default router;
