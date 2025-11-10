import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  userId: mongoose.Types.ObjectId
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    stockQuantity: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
