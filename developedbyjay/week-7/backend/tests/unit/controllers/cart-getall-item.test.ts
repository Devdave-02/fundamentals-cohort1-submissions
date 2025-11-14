import { getAllCartItems } from "../../../src/controllers/v1/cart/getall-item";
import { Cart } from "../../../src/models/cart";

describe("cart getAllCartItems controller", () => {
  const mockRes: any = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => jest.restoreAllMocks());

  it("should return populated cart items", async () => {
    const items = [{ products: [{ productId: { name: "p" }, quantity: 1 }] }];
    jest
      .spyOn(Cart, "find" as any)
      .mockReturnValue({ populate: async () => items } as any);

    const req: any = { params: { userId: "u" } };
    const res = mockRes();
    const next = jest.fn();

    await (getAllCartItems as any)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: items })
    );
  });
});
