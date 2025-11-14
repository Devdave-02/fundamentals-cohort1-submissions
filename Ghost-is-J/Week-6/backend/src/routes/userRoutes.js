import express from "express";
import {createUser, getAllUsers, getUserById, updateUser} from "../controllers/user.controller.js";
import {validateRequest} from "../middlewares/validateRequest.js";
import {z} from "zod";

export const userRouter = express.Router();

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  balance: z.number().optional()
});

userRouter.post("/", validateRequest(createUserSchema), createUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", updateUser);