const db = require('./db');
const config = require('../config');

// Utility function to create Error object
function createError(message, statusCode) {
  let error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

// Get miners by page
function getMultiple(page = 1) {
  const offset = (page - 1) * config.listPerPage;
  const data = db.query(`SELECT * FROM miners LIMIT ?,?`, [offset, config.listPerPage]);
  const hasNextPage = db.query(`SELECT * FROM miners LIMIT ?,?`, [offset + config.listPerPage, 1]).length > 0;
  const meta = { page, hasNextPage };

  return { data, meta };
}

// Get miner by node id
function getOne(nodeId) {
  const miner = db.query('SELECT * FROM miners WHERE node_id = ?', [nodeId]);
  if (!miner.length) {
    throw createError('Miner not found', 404);
  }

  return { data: [miner[0]] };
}

// Update miner by node id
function update(nodeId, miner) {
  if (!nodeId || !miner.walletAddress) {
    throw createError('Missing miner information for update', 400);
  }

  const result = db.run('UPDATE miners SET wallet_address = ? WHERE node_id = ?', [miner.walletAddress, nodeId]);

  if (!result.changes) {
    throw createError('Error in updating miner', 500);
  }

  return { message: 'Miner updated successfully' };
}

// Delete miner by node id
function deleteMiner(nodeId) {
  const result = db.run('DELETE FROM miners WHERE node_id = ?', [nodeId]);

  if (!result.changes) {
    throw createError('Error in deleting miner', 500);
  }

  return { message: 'Miner deleted successfully' };
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
    throw createError(messages.join('. '), 400);
  }
}

// Create miner
function create(minerObj) {
  validateCreate(minerObj);
  const node_id = minerObj.nodeId;
  const wallet_address = minerObj.walletAddress;

  try {
    const result = db.run('INSERT INTO miners (node_id, wallet_address) VALUES (?, ?)', [node_id, wallet_address]);

    if (result.changes) {
      return { message: 'Miner added successfully' };
    } else {
      throw createError('No changes made to the database', 500);
    }
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT' || error.message.includes('UNIQUE constraint failed')) {
      throw createError('A miner with the given node_id already exists', 409); // 409 Conflict
    } else {
      throw error; // Re-throw the error if it's not a constraint violation.
    }
  }
}

module.exports = {
  getMultiple,
  create,
  getOne,
  update,
  deleteMiner
};