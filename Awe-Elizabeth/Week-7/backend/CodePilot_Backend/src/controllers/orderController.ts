import { Request, Response } from "express";
import Order, { IOrder, IOrderedProduct } from "../models/Orders";
import Product from "../models/Products";
import { isOrderProduct } from "../utilities/utilityFunction"

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {productDetails } = req.body;

    if(!Array.isArray(productDetails)){
      return res.status(400).json({success: false, message: "product object is not in the correct format"})
    }

    // calculate total amount
    let totalAmount = 0;
    for (const item of productDetails) {
      if(!isOrderProduct(item)){
        console.log("get here")
        return res.status(400).json({success: false, message: "product object is not in the correct format"})
      }
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      item.price = product.price
      totalAmount += item.quantity * product.price;
    }

    const order: IOrder = await Order.create({
      userId: req.user?.id,
      products: productDetails.map((p: IOrderedProduct) => ({
        productId: p.productId,
        quantity: p.quantity,
        price: p.price,
      })),
      totalAmount,
    });

    return res.status(201).json({success: true, message: "success", result: order});
  } catch (error) {
    return res.status(400).json({ message: "Error creating order", error });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("products.productId");
    return res.status(200).json({success: true, message: "success", result: orders});
  } catch (error) {
    return res.status(500).json({ message: "Error fetching orders", error });
  }
};

export const getUsersOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({userId: req.user?.id }).populate("products.productId");
    return res.status(200).json({success: true, message: "success", result: orders});
  } catch (error) {
    return res.status(500).json({ message: "Error fetching orders", error });
  }
};


export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({success: true, message: "success", result: order});
  } catch (error) {
    return res.status(400).json({ message: "Invalid order ID", error });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = status;
    await order.save();
    return res.status(200).json({success: true, message: "success", result: order});
  } catch (error) {
    return res.status(400).json({ message: "Error updating order", error });
  }
};

