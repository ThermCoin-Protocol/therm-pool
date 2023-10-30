const db = require('./db');
const config = require('../config');

// Get miners by page
function getMultiple(page = 1) {
  const offset = (page - 1) * config.listPerPage;
  const data = db.query(`SELECT * FROM miners LIMIT ?,?`, [offset, config.listPerPage]);
  const meta = {page};
  return {
    data,
    meta
  }
}

// Get miner by node id
function getOne(nodeId) {
  const miner = db.query('SELECT * FROM miners WHERE node_id = ?', [nodeId]);
  if (!miner) {
    let error = new Error('Miner not found');
    error.statusCode = 404;

    throw error;
  }

  return miner;
}

// Update miner by node id
function update(nodeId, miner) {
  const {id, address} = miner;
  const result = db.run('UPDATE miners SET wallet_address = ? WHERE node_id = ?', [address, nodeId]);

  let message = 'Error in updating miner';
  if (result.changes) {
    message = 'Miner updated successfully';
  }

  return {message};
}

// Delete miner by node id
function deleteMiner(nodeId) {
  const result = db.run('DELETE FROM miners WHERE node_id = ?', [nodeId]);

  let message = 'Error in deleting miner';
  if (result.changes) {
    message = 'Miner deleted successfully';
  }

  return {message};
}

// Validate miner object
function validateCreate(miner) {
  let messages = [];

  if (!miner) {
    messages.push('No object is provided');
  }

  if (!miner.nodeId) {
    messages.push('nodeId is empty');
  }

  if (!miner.walletAddress) {
    messages.push('walletAddress is empty');
  }
  
  if (messages.length) {
    let error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
  }
}

// Create miner
function create(minerObj) {
  validateCreate(minerObj);
  const node_id = minerObj.nodeId;
  const wallet_address = minerObj.walletAddress;
  const result = db.run('INSERT INTO miners (node_id, wallet_address) VALUES (@node_id, @wallet_address)', {node_id, wallet_address});
  
  let message = 'Error in adding miner';
  if (result.changes) {
    message = 'Miner added successfully';
  }

  return {message};
}

module.exports = {
  getMultiple,
  create,
  getOne,
  update,
  deleteMiner
}
