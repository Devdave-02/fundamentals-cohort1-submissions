import { generateAccessToken, verifyAccessToken } from "../../src/_lib/jwt";

describe("JWT utilities - unit", () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV };
    process.env.JWT_ACCESS_SECRET = "test-secret";
    process.env.ACCESS_TOKEN_EXPIRES = "1h";
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should generate and verify access token", () => {
    const payload = { userId: "507f1f77bcf86cd799439011" } as any;
    const token = generateAccessToken(payload);
    expect(typeof token).toBe("string");

    const decoded: any = verifyAccessToken(token);
    expect(decoded).toBeDefined();
    expect(decoded.userId).toEqual(payload.userId);
  });
});
