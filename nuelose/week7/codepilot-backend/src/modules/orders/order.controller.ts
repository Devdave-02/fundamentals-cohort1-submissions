import { Request, Response } from "express";
import { orderService } from "./order.service";
import { CreateOrderSchema } from "./order.schema";

export const orderController = {
  async create(req: Request, res: Response) {
    try {
      const data = CreateOrderSchema.parse(req.body);
      const userId = (req as any).user?.id;

      if (!userId) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Missing user ID" });
      }

      const order = await orderService.createOrder(userId, data);
      return res.status(201).json({ data: order });
    } catch (error: any) {
      console.error("Order creation error:", error);
      return res.status(400).json({ message: error.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const orders = await orderService.getOrders(userId);
      return res.status(200).json({ data: orders });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const id = parseInt(req.params.id);
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const order = await orderService.getOrderById(userId, id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      return res.status(200).json({ data: order });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
};
