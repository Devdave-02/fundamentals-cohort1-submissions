import { deleteUser } from "@src/controllers/v1/users/delete.user";
import { getUsers } from "@src/controllers/v1/users/get.users";
import { authenticate } from "@src/middleware/authenticate";
import { authorization } from "@src/middleware/authorization";
import { validator } from "@src/middleware/validator";
import { paginationSchema } from "@src/schemas/base.schema";
import { userParamSchema } from "@src/schemas/user.schema";
import { Router } from "express";

const router = Router();

router.get(
  "/",
  authenticate,
  authorization(["admin", "user"]),
  validator(paginationSchema),
  getUsers
);

router.delete(
  "/:userId",
  authenticate,
  authorization(["admin"]),
  validator(userParamSchema),
  deleteUser
);
export { router as userRouter };
