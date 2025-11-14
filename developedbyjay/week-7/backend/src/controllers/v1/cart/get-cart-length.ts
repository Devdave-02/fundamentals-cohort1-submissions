import { NextFunction, Request, Response } from "express";
import { catchAsync } from "@/_lib/appError";
import { Cart } from "@/models/cart";

const getCartLength = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const cartItems = await Cart.find({ userId });
    const cartLength = cartItems.reduce((total, item) => {
      return total + item.products.length;
    }, 0);

    res.status(200).json({
      success: true,
      itemCount: cartLength,
    });
  }
);
export { getCartLength };

