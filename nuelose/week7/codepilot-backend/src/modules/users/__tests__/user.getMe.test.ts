import request from "supertest";
import app from "../../../app";
import prisma from "../../../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

describe("GET /api/users/me", () => {
  let token: string;

  beforeEach(async () => {
    await prisma.user.deleteMany();

    const password = await bcrypt.hash("Password123", 10);
    const user = await prisma.user.create({
      data: {
        name: "Emmanuel",
        email: "me@example.com",
        password,
      },
    });

    token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  it("should return current user details if token is valid", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("email", "me@example.com");
  });

  it("should fail if token is missing", async () => {
    const res = await request(app).get("/api/users/me");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("No token provided");
  });

  it("should fail if token is invalid", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.status).toBe(401);
  });
});
