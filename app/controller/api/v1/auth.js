const { PrismaClient } = require("@prisma/client");
const { hashPassword, checkPassword } = require("../../../../utils/auth");
const { JWTSign } = require("../../../../utils/jwt");
const app = require("../../../../utils/firebaseConfig");
const {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} = require("firebase/auth");
const prisma = new PrismaClient();
const auth = getAuth(app);

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Account not found. Please register." });
    }
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        const usr = userCredentials.user;
        const emailVerified = usr.emailVerified;

        await prisma.user.update({
          where: { email: user.email },
          data: {
            email_verified: emailVerified,
          },
        });

        delete user.password;
        const token = await JWTSign(user);
        return res.status(201).json({
          status: "success",
          message: "Login successfully",
          data: { user, token },
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return res.status(401).json({ message: "Invalid email or password." });
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
    try {
      const { email, password, name, profile } = req.body;
      const user = await prisma.user.findFirst({
        where: { email },
      });
      if (user) {
        return res.status(404).json({ message: "User already exists" });
      }
      const hashedPassword = await hashPassword(password);
      const createUser = await prisma.user.create({
        data: {
          name,
          email,
          email_verified: false,
          password: hashedPassword,
          profile: {
            create: profile,
          },
        },
      });
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              console.log("Email verfification sent!");
            })
            .catch((error) => {
              console.log(error);
            });
          const user = userCredentials.user;
          console.log("Successfully created new user:", user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Error creating new user: ", errorCode, errorMessage);
        });
      return res.status(201).json({
        status: "success",
        message:
          "Register successfully. Check your email to verify your account!",
        data: createUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Gagal membuat user baru" });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    sendPasswordResetEmail(auth, email)
      .then(() => {
        res.status(201).json({
          code: 201,
          status: "success",
          message: "Password reset email sent. Check your email!",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
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
