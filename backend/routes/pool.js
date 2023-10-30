const express = require('express');
const router = express.Router();
const pool = require('../services/pool');

/* GET page of miners. */
router.get('/', function(req, res, next) {
  try {
    res.json(pool.getMultiple(req.query.page));
  } catch(err) {
    console.error(`Error while getting miners`, err.message);
    next(err);
  }
});

/* GET miner by node id. */
router.get('/:nodeId', function(req, res, next) {
  try {
    res.json(pool.getOne(req.params.nodeId));
  } catch(err) {
    console.error(`Error while getting miner`, err.message);
    next(err);
  }
});

/* PUT miner by node id. */
router.put('/:nodeId', function(req, res, next) {
  try {
    res.json(pool.update(req.params.nodeId, req.body));
  } catch(err) {
    console.error(`Error while updating miner`, err.message);
    next(err);
  }
});

/* POST miner */
router.post('/', function(req, res, next) {
  try {
    res.json(pool.create(req.body));
  } catch(err) {
    console.error(`Error while adding miner`, err.message);
    next(err);
  }
});

/* DELETE miner by node id. */
router.delete('/:nodeId', function(req, res, next) {
  try {
    res.json(pool.deleteMiner(req.params.nodeId));
  } catch(err) {
    console.error(`Error while deleting miner`, err.message);
    next(err);
  }
});



module.exports = router;
