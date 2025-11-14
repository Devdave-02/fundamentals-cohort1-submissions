import { Request, Response } from "express";
import { productService } from "./product.service";
import { createProductSchema, updateProductSchema } from "./product.schema";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const validated = createProductSchema.parse(req.body);

    const product = await productService.create(validated);
    return res.status(201).json({ message: "Product created", product });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await productService.findAll();
  return res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = await productService.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const validated = updateProductSchema.parse(req.body);
    const updated = await productService.update(id, validated);
    return res.json({ message: "Product updated", product: updated });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await productService.remove(id);
    return res.json({ message: "Product deleted" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
