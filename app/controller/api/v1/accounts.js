const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createAccount = async (req, res) => {
  try {
    const { user_id, bank_name, bank_account_number, balance } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }
    const account = await prisma.bankAccount.create({
      data: {
        user: {
          connect: {
            id: user_id,
          },
        },
        bank_name,
        bank_account_number,
        balance,
      },
    });
    res.json(account);
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
    res.json(accounts);
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
    res.json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil detail akun" });
  }
};

const Deposit = async (req, res) => {
  try {
    const { bank_account_number, amount } = req.body;
    // Validasi bahwa akun ada
    const account = await prisma.bankAccount.findUnique({
      where: { bank_account_number: bank_account_number },
    });

    if (!account) {
      return res.status(404).json({ error: "Akun tidak ditemukan" });
    }
    // Melakukan deposit
    const updatedAccount = await prisma.bankAccount.update({
      where: { bank_account_number: bank_account_number },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
    res.json({ message: "Deposit berhasil", updatedAccount });
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
    const updatedAccount = await prisma.bankAccount.update({
      where: { bank_account_number: bank_account_number },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });
    res.json({ message: "Penarikan berhasil", updatedAccount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal melakukan penarikan" });
  }
};

module.exports = {
  createAccount,
  getAccounts,
  getAccountById,
  Deposit,
  WithDraw,
};
