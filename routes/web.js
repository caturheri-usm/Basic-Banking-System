const express = require("express");
const router = express.Router();
const passport = require("../utils/passport");
const { auth } = require("../utils/jwt");

const controller = require("../app/controller");

router.post("/api/v1/login", controller.auth.login);
router.post("/api/v1/register", controller.auth.register);
router.get("/api/v1/authenticate", auth, controller.auth.whoami);

router.get("/api/v1/users", auth, controller.users.getUsers);
router.get("/api/v1/users/:id", auth, controller.users.getUserById);
router.post("/api/v1/users", auth, controller.users.createUser);
router.put("/api/v1/users/:id", auth, controller.users.updateUser);
router.delete("/api/v1/users/:id", auth, controller.users.deleteUser);

router.get("/api/v1/accounts", auth, controller.accounts.getAccounts);
router.get("/api/v1/accounts/:id", auth, controller.accounts.getAccountById);
router.post("/api/v1/accounts", auth, controller.accounts.createAccount);

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
module.exports = router;
