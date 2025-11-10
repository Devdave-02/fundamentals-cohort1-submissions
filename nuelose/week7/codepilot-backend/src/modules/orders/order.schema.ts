import { z } from "zod";

export const OrderItemSchema = z.object({
  productId: z.number().int(),
  qty: z.number().int().positive(),
});

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).nonempty(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
