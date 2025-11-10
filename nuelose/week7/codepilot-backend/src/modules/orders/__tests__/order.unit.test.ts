import { orderService } from "../order.service";
import { prisma } from "../../../tests/setup";

describe("Order Service - Unit", () => {
  beforeEach(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should create an order with valid data", async () => {
    const user = await prisma.user.create({
      data: { email: "user@example.com", password: "hashed" },
    });
    const product = await prisma.product.create({
      data: { name: "Phone", price: 800, stock: 10 },
    });

    const order = await orderService.createOrder(user.id, {
      items: [{ productId: product.id, qty: 1 }],
    });

    expect(order.total).toBe(800);
    expect(order.items.length).toBe(1);
  });
});
