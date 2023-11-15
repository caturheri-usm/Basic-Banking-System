const { PrismaClient } = require("@prisma/client");
const { hashPassword, checkPassword } = require("../../../../utils/auth");
const { JWTSign } = require("../../../../utils/jwt");

const prisma = new PrismaClient();

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Wrong password" });
    }
    delete user.password;
    const token = await JWTSign(user);
    return res.status(201).json({
      status: "success",
      message: "Login successfully",
      data: { user, token },
    });
  },

  async whoami(req, res) {
    return res.status(200).json({
      status: "success",
      message: "User found",
      data: req.user,
    });
  },

  async register(req, res) {
    const { email, password, name } = req.body;
    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (user) {
      return res.status(404).json({ message: "User already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const createUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    return res.status(201).json({
      status: "success",
      message: "Register successfully",
      data: createUser,
    });
  },

  registerForm: async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      console.log(req.body);
      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (user) {
        req.flash("error", "User already exists");
        return res.redirect("/register");
      }
      const createUser = await prisma.user.create({
        data: {
          email,
          name,
          password: await hashPassword(password),
        },
      });
      req.flash("success", "Register successfully");
      return res.redirect("/login");
    } catch (err) {
      next(err);
    }
  },

  authUser: async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !(await checkPassword(password, user.password))) {
        return done(null, false, { message: "Invalid email or password" });
      }
      return done(null, user);
    } catch (err) {
      return done(null, false, { message: err.message });
    }
  },

  // oauth: async (req, res) => {
  //   const token = await JWTSign({
  //     ...req.user,
  //     password: null,
  //   });
  //   return res.json({
  //     status: "success",
  //     message: "Berhasil Login!",
  //     data: { token },
  //   });
  // },
};
