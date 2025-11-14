import request from "supertest";
import app from "../../../app";
import prisma from "../../../prisma/client";

describe("User Registration", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it("should register a new user successfully", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "TestPass123",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User created successfully");
    expect(res.body.user).toHaveProperty("email", "testuser@example.com");

    const userInDB = await prisma.user.findUnique({
      where: { email: "testuser@example.com" },
    });
    expect(userInDB).not.toBeNull();
  });

  it("should fail if email already exists", async () => {
    await prisma.user.create({
      data: { name: "Existing", email: "dup@example.com", password: "hashed" },
    });

    const res = await request(app).post("/api/users").send({
      name: "Dup User",
      email: "dup@example.com",
      password: "123456",
    });

    expect(res.status).toBe(400);
  });
});
