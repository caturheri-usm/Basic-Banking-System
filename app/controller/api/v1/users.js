const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createUser = async (req, res) => {
  try {
    const { name, email, password, profile } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        profile: {
          create: profile,
        },
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menambahkan user baru" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil daftar users" });
  }
};

const getUsersById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil detail user" });
  }
};



module.exports = {
  createUser,
  getUsers,
  getUsersById,
};
