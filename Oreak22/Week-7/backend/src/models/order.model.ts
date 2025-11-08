import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrder extends Document {
  _id: any;
  user: Types.ObjectId | string;
  product: Types.ObjectId | string;
  quantity: number;
}

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
