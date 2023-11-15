const base = require("../app/controller/api/v1/auth");
const mockRequest = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
});
const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe("auth.register function", () => {
  test("res.json called with register user data", async () => {
    const req = mockRequest(
      {
        name: "John Doe",
        email: "john@mail.com",
        password: "123456",
      },
      {},
      {}
    );
    const res = mockResponse();
    await base.register(req, res);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        message: "Register successfully",
        data: expect.any(Object),
      })
    );
  });
});

describe("auth.login function", () => {
  test("res.json called with login user data", async () => {
    const req = mockRequest(
      { email: "john@mail.com", password: "123456" },
      {},
      {}
    );
    const res = mockResponse();
    await base.login(req, res);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        message: "Login successfully",
        data: expect.any(Object),
      })
    );
  });
});

describe("auth.whoami function", () => {
  test("res.json called with user data", async () => {
    const req = mockRequest({}, {}, {});
    const res = mockResponse();
    await base.whoami(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        message: "User found",
        data: expect.any(Object),
      })
    );
  });
});
