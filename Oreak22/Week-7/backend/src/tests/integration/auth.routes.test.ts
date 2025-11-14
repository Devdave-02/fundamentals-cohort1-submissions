import request from "supertest";
import app from "../../app";

describe("POST /auth/register", () => {
  it("registers a user successfully", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@mail.com", password: "secret123" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });
});
