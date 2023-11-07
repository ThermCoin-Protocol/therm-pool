const express = require('express');
const router = express.Router();
const pool = require('../services/pool');

// Error handler function
function handleErrors(res, err) {
  console.error(err.message);
  res.status(err.statusCode || 500).json({ error: err.message });
}

/* GET page of miners. */
router.get('/', function(req, res) {
  try {
    res.json(pool.getMultiple(req.query.page));
  } catch(err) {
    handleErrors(res, err);
  }
});

/* GET miner by node id. */
router.get('/:nodeId', function(req, res) {
  try {
    res.json(pool.getOne(req.params.nodeId));
  } catch(err) {
    handleErrors(res, err);
  }
});

/* PUT miner by node id. */
router.put('/:nodeId', function(req, res) {
  try {
    res.json(pool.update(req.params.nodeId, req.body));
  } catch(err) {
    handleErrors(res, err);
  }
});

/* POST miner */
router.post('/', function(req, res) {
  try {
    res.json(pool.create(req.body));
  } catch(err) {
    handleErrors(res, err);
  }
});

/* DELETE miner by node id. */
router.delete('/:nodeId', function(req, res) {
  try {
    res.json(pool.deleteMiner(req.params.nodeId));
  } catch(err) {
    handleErrors(res, err);
  }
});

module.exports = router;