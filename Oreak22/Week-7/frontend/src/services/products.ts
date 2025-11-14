import type { Product } from "@/types/product";
import { api } from "../lib/api";

export const productsService = {
  list: () => api.get<Product[]>("/products"),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
};
