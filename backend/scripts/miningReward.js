const axios = require('axios');
const Web3 = require('web3');
const db = require('../db/connection');
const encryption = require('../utils/encryption');

const web3 = new Web3('http://localhost:8545'); // Replace with your Ethereum node URL
const ERC20_ABI = []; // Replace with your ERC20 token ABI
const ERC20_ADDRESS = ''; // Replace with your ERC20 token address
const COMPANY_WALLET_ADDRESS = ''; // Replace with your company wallet address
const COMPANY_WALLET_PRIVATE_KEY = ''; // Replace with your company wallet private key

const distributeTokens = async () => {
  const nodes = db.readDatabase();
  const peers = await axios.post('http://localhost:8545', {
    jsonrpc: '2.0',
    method: 'admin_peers',
    params: [],
    id: 1
  });
  for (const peer of peers.data.result) {
    const node = nodes.find(node => node.nodeId === peer.id);
    if (node) {
      const contract = new web3.eth.Contract(ERC20_ABI, ERC20_ADDRESS);
      const decryptedPublicKey = encryption.decrypt(node.publicKey, node.password);
      const tx = {
        to: decryptedPublicKey,
        value: web3.utils.toWei('100', 'ether'),
        gas: 2000000
      };
      const signedTx = await web3.eth.accounts.signTransaction(tx, COMPANY_WALLET_PRIVATE_KEY);
      await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }
  }
};

web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
  if (error) {
    console.error(error);
  } else {
    distributeTokens();
  }
});