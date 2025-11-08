import { createOrder } from "../../controllers/order/orders.service";
import mongoose from "mongoose";

describe("Orders Service - Unit", () => {
  it("creates an order object", async () => {
    // create minimal fake ids (ObjectId strings)
    const productId = new mongoose.Types.ObjectId().toString();
    const userId = new mongoose.Types.ObjectId().toString();
    const newOrder = await createOrder({ userId, productId });
    expect(newOrder).toHaveProperty("_id");
    expect(newOrder.product.toString()).toBe(productId);
    expect(newOrder.user.toString()).toBe(userId);
  });
});
