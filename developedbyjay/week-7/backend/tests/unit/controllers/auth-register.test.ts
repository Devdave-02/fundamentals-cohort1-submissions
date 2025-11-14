import { register } from "../../../src/controllers/v1/auth/register";
import { User } from "../../../src/models/user";

describe("auth/register controller", () => {
  const mockRes: any = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => jest.restoreAllMocks());

  it("should create user and return accessToken", async () => {
    const user = {
      _id: "uid",
      name: "u",
      email: "a@b.com",
      password: "p",
    } as any;

    jest.spyOn(User, "create" as any).mockResolvedValue(user);
    jest
      .spyOn(require("../../../src/_lib/jwt"), "generateTokens")
      .mockResolvedValue({ accessToken: "token" });

    const req: any = { body: { name: "u", email: "a@b.com", password: "p" } };
    const res = mockRes();
    const next = jest.fn();

    await (register as any)(req, res, next);

    expect(User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        data: { user },
        accessToken: "token",
      })
    );
  });
});
