import { getCartLength } from "../../../src/controllers/v1/cart/get-cart-length";
import { Cart } from "../../../src/models/cart";

describe("cart getCartLength controller", () => {
  const mockRes: any = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => jest.restoreAllMocks());

  it("should return total item count across user carts", async () => {
    const carts = [{ products: [1, 2] }, { products: [1] }];
    jest.spyOn(Cart, "find" as any).mockResolvedValue(carts as any);

    const req: any = { params: { userId: "u" } };
    const res = mockRes();
    const next = jest.fn();

    await (getCartLength as any)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, itemCount: 3 })
    );
  });
});
