import { Types } from "mongoose";
import type { IUser } from "@src/models/user";

export type Role = "admin" | "user";

export interface TokenPayload {
  userId: Types.ObjectId;
}
export type UserLoginRequestBody = Pick<IUser, "email" | "password">;

export type UserRequestBody = Pick<
  IUser,
  "name" | "email" | "password" | "role"
>;


