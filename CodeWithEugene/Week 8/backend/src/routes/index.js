const express = require('express');
const healthRouter = require('./health');
const statusRouter = require('./status');

const router = express.Router();

router.use('/health', healthRouter);
router.use('/status', statusRouter);

module.exports = router;
