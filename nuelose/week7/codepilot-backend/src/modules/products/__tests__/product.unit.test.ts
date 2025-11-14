// src/modules/products/__tests__/product.unit.test.ts
import { createProductSchema } from "../product.schema";
import { productService } from "../product.service";


jest.mock("@prisma/client", () => {
  const mPrisma = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe("Product Module - Unit Tests", () => {
  it("should validate product data successfully", () => {
    const data = { name: "Phone", price: 499.99, stock: 10 };
    const parsed = createProductSchema.parse(data);
    expect(parsed).toEqual(data);
  });

  it("should throw error for invalid price", () => {
    const data = { name: "Phone", price: -10, stock: 5 };
    expect(() => createProductSchema.parse(data)).toThrow();
  });

  it("should call prisma.product.create with correct data", async () => {
    const mockCreate = jest
      .fn()
      .mockResolvedValue({ id: 1, name: "Phone", price: 499, stock: 10 });
    (productService as any).create = mockCreate;

    const result = await productService.create({
      name: "Phone",
      price: 499,
      stock: 10,
    });
    expect(result).toHaveProperty("id");
    expect(mockCreate).toHaveBeenCalled();
  });
});
