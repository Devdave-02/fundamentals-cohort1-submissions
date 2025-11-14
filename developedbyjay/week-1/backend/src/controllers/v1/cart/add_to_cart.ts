import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "@/_lib/appError";
import { Cart } from "@/models/cart";
import { AddCartBody } from "@/utils/types";

export const addToCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { productId, quantity } = req.body as AddCartBody;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const newCart = await Cart.create({
        userId,
        products: [{ productId, quantity }],
      });

      return res.status(201).json({
        success: true,
        data: newCart,
      });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += Number(quantity);
    } else {
      cart.products.push({ productId, quantity: Number(quantity) });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  }
);
