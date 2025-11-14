import { addToCart } from "../../../src/controllers/v1/cart/add-to-cart";
import { Cart } from "../../../src/models/cart";

describe("cart addToCart controller", () => {
  const mockRes: any = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => jest.restoreAllMocks());

  it("should create a new cart when none exists", async () => {
    jest.spyOn(Cart, "findOne" as any).mockResolvedValue(null);
    const created = {
      userId: "u",
      products: [{ productId: "p", quantity: 1 }],
    } as any;
    jest.spyOn(Cart, "create" as any).mockResolvedValue(created);

    const req: any = { userId: "u", body: { productId: "p", quantity: 1 } };
    const res = mockRes();
    const next = jest.fn();

    await (addToCart as any)(req, res, next);

    expect(Cart.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: created })
    );
  });

  it("should update existing cart when product exists and save", async () => {
    const cart: any = {
      products: [{ productId: { toString: () => "p" }, quantity: 1 }],
      save: jest.fn().mockResolvedValue(true),
    };
    jest.spyOn(Cart, "findOne" as any).mockResolvedValue(cart);

    const req: any = { userId: "u", body: { productId: "p", quantity: 2 } };
    const res = mockRes();
    const next = jest.fn();

    await (addToCart as any)(req, res, next);

    expect(cart.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: cart })
    );
  });
});
