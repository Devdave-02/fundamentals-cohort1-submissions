import { Router } from "express";

import { authenticate } from "@src/middleware/authentication";
import { authorization } from "@src/middleware/authorization";
import { getCurrentUser } from "@src/controllers/v1/user/current-user";

const router = Router();

router.get(
  "/current-user",
  authenticate,
  authorization(["user", "admin"]),
  getCurrentUser
);

export default router;
