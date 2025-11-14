import { logout } from "../../../src/controllers/v1/auth/logout";

describe("auth/logout controller", () => {
  const mockRes: any = () => {
    const res: any = {};
    res.clearCookie = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  it("should clear cookie and send 204", async () => {
    const req: any = {};
    const res = mockRes();
    const next = jest.fn();

    await (logout as any)(req, res, next);

    expect(res.clearCookie).toHaveBeenCalledWith("accessToken");
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
