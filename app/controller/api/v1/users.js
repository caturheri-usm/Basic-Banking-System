const { PrismaClient } = require("@prisma/client");
const app = require("../../../../utils/firebaseConfig");
const { getAuth, deleteUser } = require("firebase/auth");

const auth = getAuth(app);
const prisma = new PrismaClient();

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Berhasil mengambil daftar users",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil daftar users" });
  }
};

const getUserById = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({ error: "Missing required fields" });
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        profile: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Berhasil mengambil detail user",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the user" });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!req.params.id || !req.body) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    let currentUserID = await prisma.user.findUnique({
      include: { profile: true },
      where: { id: Number(req.params.id) },
    });
    if (!currentUserID) {
      return res.status(404).json({ error: "User not found" });
    }
    const { name, email, password, profile } = req.body;
    const user = await prisma.user.update({
      where: { id: currentUserID },
      data: {
        name,
        email,
        password,
        profile: {
          update: {
            where: {
              userId: Number(req.params.id),
            },
            data: {
              identity_type: profile.identity_type,
              identity_number: profile.identity_number,
              address: profile.address,
            },
          },
        },
      },
    });
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Berhasil mengubah user",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengubah user" });
  }
};

const destroyUser = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    let currentUserID = await prisma.user.findUnique({
      include: {
        profile: true,
      },
      where: { id: Number(req.params.id) },
    });
    if (!currentUserID) {
      return res.status(404).json({ error: "User not found" });
    }
    let profile = await prisma.profile.delete({
      where: { userId: Number(req.params.id) },
    });
    const user = await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });
    deleteUser(auth.currentUser).then(() => {
      console.log("User deleted");
    });
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Berhasil menghapus user",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menghapus user" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  destroyUser,
};
