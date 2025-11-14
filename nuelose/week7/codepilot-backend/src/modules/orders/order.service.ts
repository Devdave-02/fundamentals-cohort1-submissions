import prisma from "../../prisma/client";
import { CreateOrderInput } from "./order.schema";

export const orderService = {
  async createOrder(userId: number, data: CreateOrderInput) {
    const products = await prisma.product.findMany({
      where: { id: { in: data.items.map((i) => i.productId) } },
    });

    let total = 0;
    const orderItems = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      total += product.price * item.qty;
      return {
        productId: item.productId,
        qty: item.qty,
        price: product.price,
      };
    });

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    return order;
  },

  async getOrders(userId: number) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
  },

  async getOrderById(userId: number, id: number) {
    return prisma.order.findFirst({
      where: { id, userId },
      include: { items: { include: { product: true } } },
    });
  },
};
