import { Types } from "mongoose";
import type { IUser } from "@models/user";

export type Role = "admin" | "user";
export interface TokenPayload {
  userId: Types.ObjectId;
}
export type UserLoginRequestBody = Pick<IUser, "email" | "password">;
export type UserRequestBody = Pick<
  IUser,
  "username" | "email" | "password" | "role"
>;

export type UserUpdateBody = Pick<
  IUser,
  "username" | "bio" | "displayName" | "email"
> & {
  newPassword?: string;
  currentPassword: string;
};
