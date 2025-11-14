import { Router } from "express";
import { validator } from "@src/middleware/validator";
import { createUserSchema, loginSchema } from "@src/schemas/user.schema";
import { login } from "@src/controllers/v1/auth/login";
import { register } from "@src/controllers/v1/auth/register";

const router = Router();

router.post("/login", validator(loginSchema), login);
router.post("/register", validator(createUserSchema), register);

export { router as authRouter };
