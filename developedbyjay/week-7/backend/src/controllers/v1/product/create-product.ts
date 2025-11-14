import { catchAsync } from "@/_lib/appError";
import { Product } from "@/models/product";
import type { NextFunction, Request, Response } from "express";
import { ProductBody } from "@/utils/types";

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, description, image } = req.body as ProductBody;

    const newProduct = await Product.create({
      name,
      price,
      description,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  }
);
