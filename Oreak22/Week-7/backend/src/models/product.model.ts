import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  _id: any;
  name: string;
  price: number;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
