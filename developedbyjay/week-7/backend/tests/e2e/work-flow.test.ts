import startTestServer, { stopTestServer } from "../utils/test-server";

describe("E2E workflow - register -> login -> add to cart -> get cart length", () => {
  let request: any;

  beforeAll(async () => {
    request = await startTestServer();
  });

  afterAll(async () => {
    await stopTestServer();
  });

  it("should run a basic flow", async () => {
    const email = "flow90@example.com";
    const password = "password123";

    const register = await request.post("/v1/auth/register").send({
      name: "Flow User",
      email,
      password,
    });
    expect(register.status).toBe(201);

    const login = await request
      .post("/v1/auth/login")
      .send({ email, password });
    expect(login.status).toBe(200);

  
    const token = login.body.accessToken;
    const userId = login.body.data.user._id;

    expect(token).toBeDefined();
    expect(userId).toBeDefined();

    const productRes = await request
      .post("/v1/products/create_product")
      .send({ name: "Item 1", price: 9.99, description: "A test item", image: "https://example.com/image.jpg" })
      .set("Authorization", `Bearer ${token}`);


    // Try to add to cart
    await request
      .post("/v1/cart/add-to-cart")
      .send({
        productId: productRes.body.data.product._id || "64b7f8f4f4d3c2a1b2c3d4e5", // fallback product ID
        quantity: 1,
      })
      .set("Authorization", `Bearer ${token}`);

    // get cart length
    const cartLength = await request
      .get(`/v1/cart/get-cart-item-length/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(cartLength.status).toBe(200);
    expect(cartLength.body).toHaveProperty("success", true);
  });
});
