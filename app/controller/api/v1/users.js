const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// const createUser = async (req, res) => {
//   try {
//     if (!req.body) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }
//     const { name, email, password, profile } = req.body;
//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) {
//       return res.status(409).json({ error: "User already exists" });
//     }
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password,
//         profile: {
//           create: profile,
//         },
//       },
//     });
//     res.status(201).json({
//       status: "success",
//       code: 201,
//       message: "Berhasil menambahkan user baru",
//       data: user,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Gagal menambahkan user baru" });
//   }
// };

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
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
    const currentUserID = req.user.id;
    if (Number(req.params.id) !== currentUserID) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    const { name, email, password, profile } = req.body;
    const user = await prisma.user.update({
      where: { id: currentUserID },
      data: {
        name,
        email,
        password,
        profile: {
          update: profile,
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

const deleteUser = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const currentUserID = req.user.id;
    if (Number(req.params.id) !== currentUserID) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    const user = await prisma.user.delete({
      where: { id: currentUserID },
      include: {
        profile: true,
      },
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
  deleteUser,
};
