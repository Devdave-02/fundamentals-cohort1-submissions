import request from "supertest";
import app from "../../../app";
import prisma from "../../../prisma/client";
import bcrypt from "bcrypt";

describe("User Login", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it("should login successfully with valid credentials", async () => {
    const password = await bcrypt.hash("TestPass123", 10);
    await prisma.user.create({
      data: { name: "Login User", email: "login@example.com", password },
    });

    const res = await request(app).post("/api/users/login").send({
      email: "login@example.com",
      password: "TestPass123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("login@example.com");
  });

  it("should fail with invalid password", async () => {
    const password = await bcrypt.hash("CorrectPass", 10);
    await prisma.user.create({
      data: { name: "Bad Pass", email: "bad@example.com", password },
    });

    const res = await request(app).post("/api/users/login").send({
      email: "bad@example.com",
      password: "WrongPass",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Incorrect Email or Password");
  });
});
