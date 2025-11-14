import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "@/_lib/appError";
import { Cart } from "@/models/cart";

export const getAllCartItems = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const cartItems = await Cart.find({ userId }).populate(
      "products.productId"
    );

    res.status(200).json({
      success: true,
      data: cartItems,
    });
  }
);
