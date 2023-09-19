const express = require('express');
const nodesController = require('../controllers/nodesController');

const router = express.Router();

router.post('/create', nodesController.createNode);
router.get('/read/:nodeId', nodesController.readNode);
router.put('/update', nodesController.updateNode);
router.delete('/delete/:nodeId', nodesController.deleteNode);

module.exports = router;