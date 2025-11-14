import { Router } from "express";
import { authenticate } from "@/middleware/authentication";
import { getCurrentUser } from "@/controllers/v1/user/current-user";

const router = Router();


router.get('/current-user', authenticate, getCurrentUser);

export { router as userRouter };