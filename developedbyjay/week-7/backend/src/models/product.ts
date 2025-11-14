import { model, Schema } from "mongoose";

export interface IProduct {
  name: string;
  description: string;
  price: number;
  image: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProduct>("Product", productSchema);
