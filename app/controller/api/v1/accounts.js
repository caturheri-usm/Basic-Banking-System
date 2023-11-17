const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createAccount = async (req, res) => {
  try {
    const { userId, bank_name, bank_account_number, balance } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    const existingAccount = await prisma.bankAccount.findUnique({
      where: { bank_account_number },
    });

    if (existingAccount) {
      return res.status(400).json({ error: "Nomor rekening sudah terdaftar" });
    }

    const account = await prisma.bankAccount.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        bank_name: bank_name,
        bank_account_number: Number(bank_account_number),
        balance : Number(balance),
      },
    });
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Berhasil membuat account",
      data: account,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menambahkan akun baru" });
  }
};

const getAccounts = async (req, res) => {
  try {
    const accounts = await prisma.bankAccount.findMany({
      orderBy: {
        id: "asc",
      },
    });
    if (accounts.length === 0) {
      return res.status(404).json({ message: "Daftar Akun Kosong" });
    }
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Berhasil mengambil daftar accounts",
      data: accounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil daftar akun" });
  }
};

const getAccountById = async (req, res) => {
  try {
    const accountId = parseInt(req.params.id);
    const account = await prisma.bankAccount.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      return res.status(404).json({ message: "Akun tidak ditemukan" });
    }
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Berhasil mengambil detail account",
      data: account,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil detail akun" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const accountId = parseInt(req.params.id);
    const account = await prisma.bankAccount.delete({
      where: { id: accountId },
    });
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Berhasil menghapus akun",
      data: account,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus akun" });
  }
};

const Deposit = async (req, res) => {
  try {
    const { bank_account_number, amount } = req.body;
    const account = await prisma.bankAccount.findUnique({
      where: { bank_account_number: bank_account_number },
    });

    if (!account) {
      return res.status(404).json({ error: "Akun tidak ditemukan" });
    }
    const depositAccount = await prisma.bankAccount.update({
      where: { bank_account_number: bank_account_number },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
    res.json({ message: "Deposit berhasil", data: depositAccount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal melakukan deposit" });
  }
};

const WithDraw = async (req, res) => {
  try {
    const { bank_account_number, amount } = req.body;
    // Validasi bahwa akun ada
    const account = await prisma.bankAccount.findUnique({
      where: { bank_account_number: bank_account_number },
    });

    if (!account) {
      return res.status(404).json({ error: "Akun tidak ditemukan" });
    }
    // Validasi saldo cukup untuk penarikan
    if (account.balance < amount) {
      return res
        .status(400)
        .json({ error: "Saldo tidak mencukupi untuk melakukan penarikan" });
    }
    // Melakukan penarikan
    const withDrawAccount = await prisma.bankAccount.update({
      where: { bank_account_number: bank_account_number },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });
    res.json({ message: "Penarikan berhasil", data: withDrawAccount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal melakukan penarikan" });
  }
};

module.exports = {
  createAccount,
  getAccounts,
  getAccountById,
  deleteAccount,
  Deposit,
  WithDraw,
};
