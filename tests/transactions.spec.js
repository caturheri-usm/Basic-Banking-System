const base = require("../app/controller/api/v1/transactions");
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

describe("transactions.getTransactions function", () => {
  test("res.json called with transactions data", async () => {
    const req = mockRequest();
    const res = mockResponse();
    await base.getTransaksi(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Berhasil mengambil daftar transactions",
        data: expect.any(Array),
      })
    );
  });
});

describe("transactions.getTransactionsById function", () => {
    test("res.json called with transaction data", async () => {
        const req = mockRequest({}, { id: 1 });
        const res = mockResponse();
        await base.getTransaksiById(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(
        expect.objectContaining({
            status: "success",
            code: 200,
            message: "Berhasil mengambil detail transaction",
            data: expect.any(Object),
        })
        );
    });
});

describe("transactions.createTransaction function", () => {
    test("res.json called with transaction data", async () => {
        const req = mockRequest(
        {
            source_account_id: 1234567890,
            destination_account_id: 9876123451,
            amount: 10000,
        },
        {},
        {}
        );
        const res = mockResponse();
        await base.createTransaksi(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(
        expect.objectContaining({
            message: "Transaksi berhasil",
            transaksi: expect.any(Object),
        })
        );
    });
});