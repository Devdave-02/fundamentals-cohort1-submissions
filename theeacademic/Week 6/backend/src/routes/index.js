const express = require('express');
const users = require('./user.routes');
const transactions = require('./transaction.routes');

const router = express.Router();

router.use('/users', users);
router.use('/transactions', transactions);

module.exports = router;
