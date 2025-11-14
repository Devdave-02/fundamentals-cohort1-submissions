import type { Request, Response, NextFunction } from "express";
import { Product } from "@/models/product";
import { catchAsync } from "@/_lib/appError";

export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      data: products,
    });
  }
);
