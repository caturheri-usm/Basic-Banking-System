const base = require("../app/controller/api/v1/accounts");
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

describe("accounts.getAccounts function", () => {
  test("res.json called with accounts data", async () => {
    const req = mockRequest();
    const res = mockResponse();
    await base.getAccounts(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Berhasil mengambil daftar accounts",
        data: expect.any(Array),
      })
    );
  });
});

describe("accounts.getAccountsById function", () => {
  test("res.json called with account data", async () => {
    const req = mockRequest({}, { id: 1 });
    const res = mockResponse();
    await base.getAccountById(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Berhasil mengambil detail account",
        data: expect.any(Object),
      })
    );
  });
});

describe("accounts.createAccount function", () => {
  test("res.json called with account data", async () => {
    const req = mockRequest(
      {
        user_id: 1,
        bank_name: "Bank BCA",
        bank_account_number: 1234567890,
        balance: 100000,
      },
      {},
      {}
    );
    const res = mockResponse();
    await base.createAccount(req, res);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 201,
        message: "Berhasil membuat account",
        data: expect.any(Object),
      })
    );
  });
});

describe("accounts.Deposit function", () => {
  test("res.json called with account data", async () => {
    const req = mockRequest(
      {
        bank_account_number: 1234567890,
        amount: 50000,
      },
      {},
      {}
    );
    const res = mockResponse();
    await base.Deposit(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        message: "Deposit Berhasil",
        data: expect.any(Object),
      })
    );
  });
});

describe("accounts.WithDraw function", () => {
  test("res.json called with account data", async () => {
    const req = mockRequest(
      {
        bank_account_number: 1234567890,
        amount: 10000,
      },
      {},
      {}
    );
    const res = mockResponse();
    await base.WithDraw(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        message: "Penarikan Berhasil",
        data: expect.any(Object),
      })
    );
  });
});
