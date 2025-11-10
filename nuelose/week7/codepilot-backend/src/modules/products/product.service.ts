import { CreateProductInput, UpdateProductInput } from "./product.schema";
import prisma from "../../prisma/client";


export const productService = {
  create: async (data: CreateProductInput) => {
    return prisma.product.create({ data });
  },

  findAll: async () => {
    return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  },

  findById: async (id: number) => {
    return prisma.product.findUnique({ where: { id } });
  },

  update: async (id: number, data: UpdateProductInput) => {
    return prisma.product.update({ where: { id }, data });
  },

  remove: async (id: number) => {
    return prisma.product.delete({ where: { id } });
  },
};
