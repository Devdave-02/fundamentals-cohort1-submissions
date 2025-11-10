import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "./Products";

export interface IOrderedProduct extends Document {
  productId: mongoose.Types.ObjectId
  quantity: number;
  price: number; // snapshot of product price at order time
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  products: IOrderedProduct[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const OrderedProductSchema = new Schema<IOrderedProduct>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema: Schema<IOrder> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: { type: [OrderedProductSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
