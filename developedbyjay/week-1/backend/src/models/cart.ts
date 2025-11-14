import { model, Schema, Types } from "mongoose";

export interface ICart {
  userId: Types.ObjectId;
  products: { productId: Types.ObjectId; quantity: number }[];
}

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Cart = model<ICart>("Cart", cartSchema);
