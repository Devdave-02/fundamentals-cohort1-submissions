import startTestServer, { stopTestServer } from "../utils/test-server";

describe("Auth routes - integration", () => {
  let request: any;

  beforeAll(async () => {
    request = await startTestServer();
  });

  afterAll(async () => {
    await stopTestServer();
  });

  it("should register a user", async () => {
    const res = await request.post("/v1/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data).toHaveProperty("user");
    expect(res.body).toHaveProperty("accessToken");
  });

  it("should login a user", async () => {

    const res = await request.post("/v1/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("accessToken");
  });
});
