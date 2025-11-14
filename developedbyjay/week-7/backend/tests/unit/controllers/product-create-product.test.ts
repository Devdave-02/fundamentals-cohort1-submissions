import { createProduct } from "../../../src/controllers/v1/product/create-product";
import { Product } from "../../../src/models/product";

describe("product createProduct controller", () => {
  const mockRes: any = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => jest.restoreAllMocks());

  it("should create new product and return 201", async () => {
    const newProduct = {
      name: "p",
      price: 1,
      description: "d",
      image: "i",
    } as any;
    jest.spyOn(Product, "create" as any).mockResolvedValue(newProduct);

    const req: any = {
      body: { name: "p", price: 1, description: "d", image: "i" },
    };
    const res = mockRes();
    const next = jest.fn();

    await (createProduct as any)(req, res, next);

    expect(Product.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Product created successfully",
        data: newProduct,
      })
    );
  });
});
