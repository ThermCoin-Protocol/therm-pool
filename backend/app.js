const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const Web3 = require('web3');

const app = express();
const port = 3000;
const web3 = new Web3('http://localhost:8545'); // Replace with your Ethereum node URL
const ERC20_ABI = []; // Replace with your ERC20 token ABI
const ERC20_ADDRESS = ''; // Replace with your ERC20 token address
const COMPANY_WALLET_ADDRESS = ''; // Replace with your company wallet address
const COMPANY_WALLET_PRIVATE_KEY = ''; // Replace with your company wallet private key

app.use(bodyParser.json());

const readDatabase = () => {
  const data = fs.readFileSync('db.json', 'utf8');
  return JSON.parse(data);
};

const writeDatabase = (data) => {
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync('db.json', json, 'utf8');
};

const encrypt = (text, password) => {
  const cipher = crypto.createCipher('aes-256-cbc', password);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (encrypted, password) => {
  const decipher = crypto.createDecipher('aes-256-cbc', password);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

app.post('/create', (req, res) => {
  const { nodeId, publicKey, password } = req.body;
  const db = readDatabase();
  const encryptedPublicKey = encrypt(publicKey, password);
  db.nodes.push({ nodeId, publicKey: encryptedPublicKey });
  writeDatabase(db);
  res.send('Node created successfully');
});

app.get('/read/:nodeId', (req, res) => {
  const { nodeId } = req.params;
  const db = readDatabase();
  const node = db.nodes.find(node => node.nodeId === nodeId);
  if (node) {
    res.send(node);
  } else {
    res.status(404).send('Node not found');
  }
});

app.put('/update', (req, res) => {
  const { nodeId, publicKey, password } = req.body;
  const db = readDatabase();
  const node = db.nodes.find(node => node.nodeId === nodeId);
  if (node) {
    const encryptedPublicKey = encrypt(publicKey, password);
    node.publicKey = encryptedPublicKey;
    writeDatabase(db);
    res.send('Node updated successfully');
  } else {
    res.status(404).send('Node not found');
  }
});

app.delete('/delete/:nodeId', (req, res) => {
  const { nodeId } = req.params;
  const db = readDatabase();
  const index = db.nodes.findIndex(node => node.nodeId === nodeId);
  if (index !== -1) {
    db.nodes.splice(index, 1);
    writeDatabase(db);
    res.send('Node deleted successfully');
  } else {
    res.status(404).send('Node not found');
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});