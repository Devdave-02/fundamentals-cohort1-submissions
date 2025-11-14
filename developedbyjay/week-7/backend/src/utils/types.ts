import { Types } from "mongoose";
import type { IUser } from "@/models/user";
import type { IProduct } from "@/models/product";
import type { ICart } from "@/models/cart";

export type UserRequestBody = Pick<IUser, "name" | "email" | "password">;

export type AddCartBody = {
  productId: Types.ObjectId;
  quantity: number;
};
export type UserLoginRequestBody = Pick<IUser, "email" | "password">;

export type ProductBody = Pick<
  IProduct,
  "name" | "description" | "price" | "image"
>;
export type CartBody = ICart;


export type TokenPayload = {
  userId: Types.ObjectId;
};
