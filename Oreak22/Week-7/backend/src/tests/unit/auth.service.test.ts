import {
  hashPassword,
  comparePassword,
} from "../../controllers/auth/auth.service";

describe("Auth Service - Unit", () => {
  it("hashes and compares passwords successfully", async () => {
    const password = "password123";
    const hash = await hashPassword(password);
    const match = await comparePassword(password, hash);
    expect(match).toBe(true);
  });
});
