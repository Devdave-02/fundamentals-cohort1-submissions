import type { Order, OrderCreateInput } from "@/types/order";
import { api } from "../lib/api";

export const ordersService = {
  create: (payload: OrderCreateInput) => api.post<Order>("/orders", payload),
  listForUser: () => api.get<Order[]>("/orders"),
};
