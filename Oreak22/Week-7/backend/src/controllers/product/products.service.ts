import Product, { IProduct } from "../../models/product.model";

export const listProducts = async (): Promise<IProduct[]> => {
  return Product.find();
};

export const getProductById = async (id: string) => {
  return Product.findById(id).lean();
};
