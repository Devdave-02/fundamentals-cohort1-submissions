import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().int().nonnegative().default(0),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  price: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
