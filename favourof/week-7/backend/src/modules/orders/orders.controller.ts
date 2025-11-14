import { Request, Response } from "express";

interface Order {
  id: number;
  product: string;
  quantity: number;
  total: number;
}

const orders: Order[] = [];

export function createOrder(req: Request, res: Response) {
  const { product, quantity, price } = req.body;
  if (!product || !quantity || !price)
    return res
      .status(400)
      .json({ message: "Product, quantity, and price are required" });

  const newOrder: Order = {
    id: orders.length + 1,
    product,
    quantity,
    total: price * quantity,
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
}

export function getAllOrders(req: Request, res: Response) {
  res.json(orders);
}

export function getOrderById(req: Request, res: Response) {
  const order = orders.find((o) => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}
