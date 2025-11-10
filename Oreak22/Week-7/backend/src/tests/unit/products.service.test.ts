import { listProducts } from "../../controllers/product/products.service";

describe("Products Service - Unit", () => {
  it("returns an array of products", async () => {
    const products = await listProducts();
    expect(Array.isArray(products)).toBe(true);
  });
});
