import request from "supertest";
import app from "../../app";

describe("GET /products", () => {
  it("returns 200 and array", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
