const express = require("express");
const router = express.Router();
const passport = require("../utils/passport");
const { auth } = require("../utils/jwt");
const storage = require("../utils/multer");
const controller = require("../app/controller");
const multer = require("multer")();

router.post("/api/v1/login", controller.auth.login);
router.post("/api/v1/register", controller.auth.register);
router.get("/api/v1/authenticate", auth, controller.auth.whoami);

router.get("/api/v1/users", auth, controller.users.getUsers);
router.get("/api/v1/users/:id", auth, controller.users.getUserById);
router.put("/api/v1/users/:id", auth, controller.users.updateUser);
router.delete("/api/v1/users/:id", auth, controller.users.deleteUser);

router.get("/api/v1/profile", controller.profile.get);
router.get("/api/v1/profile/:id", controller.profile.getById);

router.get("/api/v1/accounts", auth, controller.accounts.getAccounts);
router.get("/api/v1/accounts/:id", auth, controller.accounts.getAccountById);
router.post("/api/v1/accounts", auth, controller.accounts.createAccount);
router.delete("/api/v1/accounts/:id", auth, controller.accounts.deleteAccount);

router.get("/api/v1/transactions", auth, controller.transactions.getTransaksi);
router.get(
  "/api/v1/transactions/:id",
  auth,
  controller.transactions.getTransaksiById
);
router.post(
  "/api/v1/transactions",
  auth,
  controller.transactions.createTransaksi
);
router.delete("/api/v1/transactions/:id", auth, controller.transactions.deleteTransaksi);

router.post("/api/v1/deposit", auth, controller.accounts.Deposit);
router.post("/api/v1/withdraw", auth, controller.accounts.WithDraw);

// VIEW

router.get("/register", (req, res) => {
  res.render("register.ejs");
});
router.post("/register", controller.auth.registerForm);

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureMessage: "/login",
  })
);

router.use("/images", express.static("public/images"));
router.use("/videos", express.static("public/videos"));
router.use("/files", express.static("public/docs"));

router.post(
  "/api/v1/upload-image",
  storage.Image.single("image"),
  controller.media.uploadImage
);

router.post(
  "/api/v1/upload-video",
  storage.Video.single("video"),
  controller.media.uploadVideo
);

router.post(
  "/api/v1/upload-file",
  storage.File.single("file"),
  controller.media.uploadFile
);

//QR-CODE
router.post("/api/v1/qr-code", controller.media.generateQRCode);

//imagekit
router.post(
  "/api/v1/imagekit",
  multer.single("image"),
  controller.media.uploadImageKit
);

module.exports = router;
