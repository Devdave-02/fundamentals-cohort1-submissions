import { prisma, testUtils } from "../../../tests/setup";
import { orderService } from "../order.service";

describe("Order Module - Integration", () => {
  beforeEach(async () => {
    await testUtils.cleanDB();
  });

  it("should persist order and items in the database", async () => {
    const { user } = await testUtils.createTestUser();
    const product = await testUtils.createTestProduct();

    const order = await orderService.createOrder(user.id, {
      items: [{ productId: product.id, qty: 2 }],
    });

    const stored = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true },
    });

    expect(stored).not.toBeNull();
    expect(stored?.items.length).toBe(1);
    expect(stored?.total).toBe(product.price * 2);
  });
});
