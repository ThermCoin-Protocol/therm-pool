const express = require('express');
const router = express.Router();
const minerController = require('../controllers/minerController');

router.post('/miner', minerController.create);
router.get('/miner/:node_id', minerController.findByNodeId);
router.delete('/miner/:node_id', minerController.deleteByNodeId);
router.put('/miner/:node_id', minerController.updateWalletByNodeId);
router.get('/miners', minerController.getAll);

module.exports = router;