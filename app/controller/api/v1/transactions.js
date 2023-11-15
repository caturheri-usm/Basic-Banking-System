const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createTransaksi = async (req, res) => {
  try {
    const { source_account_id, destination_account_id, amount } = req.body;
    const sourceAccount = await prisma.bankAccount.findUnique({
      where: { bank_account_number: source_account_id },
    });
    const destinationAccount = await prisma.bankAccount.findUnique({
      where: { bank_account_number: destination_account_id },
    });
    if (!sourceAccount || !destinationAccount) {
      return res
        .status(404)
        .json({ error: "Akun sumber atau tujuan tidak ditemukan" });
    }
    if (sourceAccount.balance < amount) {
      return res
        .status(400)
        .json({ error: "Saldo tidak mencukupi untuk melakukan transaksi" });
    }
    const transaction = await prisma.$transaction([
      prisma.bankAccount.update({
        where: { bank_account_number: source_account_id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      }),
      prisma.bankAccount.update({
        where: { bank_account_number: destination_account_id },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),
      prisma.transaksi.create({
        data: {
          source_account_id,
          destination_account_id,
          amount,
          createdAt: new Date(),
        },
        select: {
          id: true,
          source_account_id: true,
          destination_account_id: true,
          amount: true,
          createdAt: true,
        },
      }),
    ]);
    res.status(200).json({ message: "Transaksi berhasil", transaksi: transaction[2] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal melakukan transaksi" });
  }
};

const getTransaksi = async (req, res) => {
  try {
    const transactions = await prisma.transaksi.findMany({
      select: {
        id: true,
        source_account_id: true,
        destination_account_id: true,
        amount: true,
        createdAt: true,
      },
    });

    if (transactions.length === 0) {
      return res.status(404).json({ message: "Daftar Transaksi Kosong" });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Berhasil mengambil daftar transactions",
      data: transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil daftar transaksi" });
  }
};

const getTransaksiById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    }
    const transaction = await prisma.transaksi.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        source_account_id: true,
        destination_account_id: true,
        amount: true,
        createdAt: true
      },
    });
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Berhasil mengambil detail transaction",
      data: transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil detail transaksi" });
  }
};

module.exports = {
  createTransaksi,
  getTransaksi,
  getTransaksiById,
};
