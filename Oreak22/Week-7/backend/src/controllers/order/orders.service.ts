import Order from "../../models/order.model";

export const createOrder = async ({
  userId,
  productId,
  quantity = 1,
}: {
  userId: string;
  productId: string;
  quantity?: number;
}) => {
  const order = await Order.create({
    user: userId,
    product: productId,
    quantity,
  });
  return order;
};

export const listOrdersForUser = async (userId: string) => {
  return Order.find({ user: userId }).populate("product").lean();
};
