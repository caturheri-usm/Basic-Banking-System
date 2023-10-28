const express = require('express');
const router = express.Router();

const controller = require('../app/controller');

router.get('/api/v1/users', controller.users.getUsers);
router.get('/api/v1/users/:id', controller.users.getUsersById);
router.post('/api/v1/users', controller.users.createUser);

router.get('/api/v1/accounts', controller.accounts.getAccounts);
router.get('/api/v1/accounts/:id', controller.accounts.getAccountById);
router.post('/api/v1/accounts', controller.accounts.createAccount);

router.get('/api/v1/transactions', controller.transactions.getTransaksi);
router.get('/api/v1/transactions/:id', controller.transactions.getTransaksiById);
router.post('/api/v1/transactions', controller.transactions.createTransaksi);

router.post('/api/v1/deposit', controller.accounts.Deposit);
router.post('/api/v1/withdraw', controller.accounts.WithDraw);

module.exports = router;
