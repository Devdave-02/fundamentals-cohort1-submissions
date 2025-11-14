import request from "supertest";
import app from "../app";

describe("Auth Module", () => {
  it("if user email and password is not provide", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "", password: "" });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("email amd password is required");
  });
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "user@test.com", password: "1234" });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("user@test.com");
  });

  it("should not allow duplicate emails", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email: "dupe@test.com", password: "1234" });
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "dupe@test.com", password: "1234" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("should login with correct credentials", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email: "me@a.com", password: "pass" });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "me@a.com", password: "pass" });
    expect(res.status).toBe(200);
    expect(res.body.token).toContain("token");
  });

  it("should reject invalid login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "x@y.com", password: "nope" });
    expect(res.status).toBe(401);
  });
});
