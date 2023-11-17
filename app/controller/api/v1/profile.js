const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  async get(req, res) {
    const { search, page = 1, limit = 10 } = req.query;
    let profiles = await prisma.profile.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        id: "asc",
      },
    });

    if (!profiles.length) {
      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Data empty",
        data: profiles,
      });
    }
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Data found",
      data: profiles,
    });
  },

  async getById(req, res) {
    let profile = await prisma.profile.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!profile) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Data found",
      data: profile,
    });
  },
};
