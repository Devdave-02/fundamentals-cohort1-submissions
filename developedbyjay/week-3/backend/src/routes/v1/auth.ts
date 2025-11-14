import { Router } from "express";
import { login } from "@src/controllers/v1/auth/login";
import { logout } from "@src/controllers/v1/auth/logout";
import { refreshToken } from "@src/controllers/v1/auth/refreshToken";
import { register } from "@src/controllers/v1/auth/register";
import { authenticate } from "@src/middleware/authentication";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/logout", authenticate, logout);
router.get("/refreshToken", refreshToken);

export default router;
