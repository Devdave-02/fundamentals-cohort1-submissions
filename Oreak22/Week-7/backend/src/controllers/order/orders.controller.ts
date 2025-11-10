import { Request, Response } from "express";
import * as service from "./orders.service";

export const create = async (req: Request, res: Response) => {
  try {
    const productId = req.body.productId;
    const quantity = req.body.quantity || 1;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!productId)
      return res.status(400).json({ message: "productId required" });
    const order = await service.createOrder({ userId, productId, quantity });
    return res.status(201).json(order);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const listForUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const orders = await service.listOrdersForUser(userId);
  return res.json(orders);
};
