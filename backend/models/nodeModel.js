const db = require('../db/connection');

exports.createNode = (nodeId, encryptedPublicKey) => {
  const nodes = db.readDatabase();
  nodes.push({ nodeId, publicKey: encryptedPublicKey });
  db.writeDatabase(nodes);
};

exports.readNode = (nodeId) => {
  const nodes = db.readDatabase();
  return nodes.find(node => node.nodeId === nodeId);
};

exports.updateNode = (nodeId, encryptedPublicKey) => {
  const nodes = db.readDatabase();
  const node = nodes.find(node => node.nodeId === nodeId);
  if (node) {
    node.publicKey = encryptedPublicKey;
    db.writeDatabase(nodes);
  }
};

exports.deleteNode = (nodeId) => {
  const nodes = db.readDatabase();
  const index = nodes.findIndex(node => node.nodeId === nodeId);
  if (index !== -1) {
    nodes.splice(index, 1);
    db.writeDatabase(nodes);
  }
};