import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/User";
import Product from "../models/Products";
import { connectTestDB, closeTestDB, clearTestDB } from "./setupTestDB";
import { UserRoles } from "../utilities/enums/UserRole";

beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe("Authentication Tests", () => {
  it("should not register a user whose passoword does not match the standard password", async () => {

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        firstName: "Elizabeth",
        lastName: "Awe",
        email: "eliz@gmail.com",
        password: "lizzy",
      })
      .expect(400);
    expect(res.body.message).toMatch("password must be at least eight characters");
  });

  it("should register users with valid details", async () => {

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        firstName: "Elizabeth",
        lastName: "Awe",
        email: "eliz@gmail.com",
        password: "Lizzy123*",
      })
      .expect(201);
    expect(res.body.message).toMatch("success");
  });

    it("should login user with the right email and password", async () => {
    
        const user = await User.create({
            firstName: "Elizabeth",
            lastName: "Awe",
            email: "lizzy@gmail.com",
            password: "Hashed123*",
            role: UserRoles.Admin,
            tokenValidity: 1
        });
        const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
            email: "lizzy@gmail.com",
            password: "Hashed123*",
        })
        .expect(200);
        expect(res.body.message).toMatch("success");
  });
});
