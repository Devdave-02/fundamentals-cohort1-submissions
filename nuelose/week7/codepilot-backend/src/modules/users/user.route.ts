import { Router } from "express";
import { createUserController, getMeController, loginUserController } from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", createUserController);
router.post("/login", loginUserController);
router.get("/me", authenticate, getMeController);

export default router;
