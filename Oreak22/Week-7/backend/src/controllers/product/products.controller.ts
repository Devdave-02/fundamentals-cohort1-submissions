import { Request, Response } from "express";
import * as service from "./products.service";

export const list = async (req: Request, res: Response) => {
  const items = await service.listProducts();
  return res.send(items);
};

export const getById = async (req: Request, res: Response) => {
  const item = await service.getProductById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  return res.send(item);
};
