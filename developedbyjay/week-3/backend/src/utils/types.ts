import { Types } from "mongoose";
import type { IUser } from "@models/user";

export type UserRequestBody = Pick<
  IUser,
  "name" | "email" | "password" | "role"
>;

export type UserLoginRequestBody = Pick<IUser, "email" | "password">;

export interface TokenPayload {
  userId: Types.ObjectId;
}

export type Role = IUser["role"];

export type TaskRequestBody = {
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "in-progress" | "completed";
  dueDate?: string;
};

export type queryStringType = {
  limit?: string;
  offset?: string;
  page?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  fields?: string;
  status?: "pending" | "in-progress" | "completed";
  priority?: "low" | "medium" | "high";
  dueDate?: {
    $gte?: Date;
    $lte?: Date;
  };
  user?: Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
};
