const express = require('express');
const nodes = require('./nodes');

const router = express.Router();

router.use('/nodes', nodes);

module.exports = router;