

import { Router } from "express";
import { create, listForUser } from "../controllers/order/orders.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, create);
router.get("/", requireAuth, listForUser);

export default router;
