const nodeModel = require('../models/nodeModel');
const encryption = require('../utils/encryption');

exports.createNode = (req, res) => {
  const { nodeId, publicKey, password } = req.body;
  const encryptedPublicKey = encryption.encrypt(publicKey, password);
  nodeModel.createNode(nodeId, encryptedPublicKey);
  res.send('Node created successfully');
};

exports.readNode = (req, res) => {
  const { nodeId } = req.params;
  const node = nodeModel.readNode(nodeId);
  if (node) {
    res.send(node);
  } else {
    res.status(404).send('Node not found');
  }
};

exports.updateNode = (req, res) => {
  const { nodeId, publicKey, password } = req.body;
  const encryptedPublicKey = encryption.encrypt(publicKey, password);
  nodeModel.updateNode(nodeId, encryptedPublicKey);
  res.send('Node updated successfully');
};

exports.deleteNode = (req, res) => {
  const { nodeId } = req.params;
  nodeModel.deleteNode(nodeId);
  res.send('Node deleted successfully');
};