import { Request, Response } from "express";

interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 1500 },
  { id: 2, name: "Phone", price: 800 },
];

export function getAllProducts(req: Request, res: Response) {
  res.json(products);
}

export function getProductById(req: Request, res: Response) {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}

export function createProduct(req: Request, res: Response) {
  const { name, price } = req.body;
  if (!name || !price)
    return res.status(400).json({ message: "Name and price are required" });

  const newProduct: Product = {
    id: products.length + 1,
    name,
    price,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
}
