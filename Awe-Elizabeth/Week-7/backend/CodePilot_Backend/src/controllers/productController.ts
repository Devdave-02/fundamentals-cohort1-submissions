import { Request, Response } from "express";
import Product, { IProduct } from "../models/Products";
import asyncHandler from "../utilities/asyncHandler";
import { isNullOrEmpty } from "../utilities/utilityFunction";
import User from "../models/User";
import { UserRoles } from "../utilities/enums/UserRole";
import Products from "../models/Products";

export const createProduct = asyncHandler( async (req: Request, res: Response) => {
  try {
    const {name, description, price, imageUrl, stockQuantity, category} = req.body
    if(!req.user?.id){
      return res.status(401).json({success: false, message: "user is unauthorized"})
    }
    if(isNullOrEmpty(name) || isNullOrEmpty(description) || isNullOrEmpty(price) || isNullOrEmpty(imageUrl) || isNullOrEmpty(stockQuantity)){
      return res.status(400).json({success: false, message: "product name, description, price, category, image url, stock quantity is required"})
    }
    const product: IProduct = await Product.create({
      userId: req.user?.id,
      name,
      description,
      price,
      imageUrl,
      stockQuantity,
      category
    });
    return res.status(201).json({success: true, message: "success", result: product});
  } catch (error) {
    return res.status(400).json({ message: "Error creating product", error });
  }
});

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find();

    return res.status(200).json({succes: true, message: "success", result: products});
  } catch (error) {
    return res.status(500).json({ message: "Error fetching products", error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.status(200).json({success: true, message: "success", result: product});
  } catch (error) {
   return res.status(400).json({ message: "Invalid product ID", error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {name, description, price, imageUrl, stockQuantity, category} = req.body

    const product = await Product.findById(id);
    if(!product){
      return res.status(404).json({success: false, message: "product does not exist"})
    }
    if(product.userId.toString() !== req.user?.id){
      return res.status(403).json({success: false, message: "you are not authorized to update this product's details"})
    }
    product.name = name? name : product.name
    product.description = description? description : product.description
    product.price = price ? price :product.price
    product.imageUrl = imageUrl ? imageUrl : product.imageUrl
    product.stockQuantity = stockQuantity? stockQuantity : product.stockQuantity
    product.category = category ? category : product.category
    await product.save()
    
    return res.status(200).json({success: true, message: "success", result: product})
  } catch (error) {
    res.status(400).json({ message: "Error updating product", error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting product", error });
  }
};
