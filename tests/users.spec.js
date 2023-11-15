const base = require("../app/controller/api/v1/users");
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

describe("users.getUsers function", () => {
  test("res.json called with users data", async () => {
    const req = mockRequest();
    const res = mockResponse();
    await base.getUsers(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Berhasil mengambil daftar users",
        data: expect.any(Array),
      })
    );
  });

  test("re.json called with no result", async () => {
    const req = mockRequest({}, {}, { page: 3 });
    const res = mockResponse();
    await base.getUsers(req, res);
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        error: "No users found",
      })
    );
  });
});

describe("users.getUsersById function", () => {
  test("res.json called with user data", async () => {
    const req = mockRequest({}, { id: 1 });
    const res = mockResponse();
    await base.getUsersById(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Berhasil mengambil detail user",
        data: expect.any(Object),
      })
    );
  });
});

describe("users.createUser function", () => {
  test("res.json called with create user data", async () => {
    const req = mockRequest({
      name: "rudi",
      email: "rudi@rudi.com",
      password: "rudi",
      profile: {
        identity_type: "rudi",
        identity_number: 987612354,
        address: "rudi",
      },
    });
    const res = mockResponse();
    await base.createUser(req, res);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 201,
        message: "Berhasil menambahkan user baru",
        data: expect.any(Object),
      })
    );
  });
});
