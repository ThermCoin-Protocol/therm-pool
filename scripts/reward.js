require('dotenv').config();
const Web3 = require('web3');
const axios = require('axios');

// Load environment variables
const {
    NETWORK_URL,
    GENESIS_WALLET_PRIV_KEY,
    ERC_CONTRACT_ADDR,
    MINER_LIST_URL
} = process.env;

// Initialize web3 instance
const web3 = new Web3(new Web3.providers.HttpProvider(NETWORK_URL));

// ERC20 Token ABI 
const tokenABI = [
    // Add your token's ABI here
];

// Contract instance
const tokenContract = new web3.eth.Contract(tokenABI, ERC_CONTRACT_ADDR);

const rewardAmt = '100'; // Amount of tokens to be distributed per miner
// Function to distribute tokens in batches
async function distributeTokensBatch(recipients, amount, batchSize) {
    for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        const tx = {
            to: ERC_CONTRACT_ADDR,
            data: tokenContract.methods.distributeReward(batch, web3.utils.toWei(amount.toString(), 'ether'), 0, batch.length).encodeABI(),
            gas: await tokenContract.methods.distributeReward(batch, web3.utils.toWei(amount.toString(), 'ether'), 0, batch.length).estimateGas({ from: web3.eth.accounts.privateKeyToAccount(GENESIS_WALLET_PRIV_KEY).address }),
        };

        await web3.eth.accounts.signTransaction(tx, GENESIS_WALLET_PRIV_KEY)
            .then(signedTx => web3.eth.sendSignedTransaction(signedTx.rawTransaction));
        console.log(`Tokens distributed to batch starting at index ${i}`);
    }
}

// Function to get miners list and distribute tokens
async function distributeTokens() {
    try {
        const response = await axios.get(MINER_LIST_URL);
        const miners = response.data;
        const minerAddresses = miners.map(miner => miner.walletAddress);

        const batchSize = 50;

        for (let i = 0; i < minerAddresses.length; i += batchSize) {
            await distributeTokensBatch(minerAddresses, rewardAmt, batchSize);
        }
    } catch (error) {
        console.error('Error in distributing tokens:', error);
    }
}

// Run the distribution every 10 minutes
setInterval(distributeTokens, 10 * 60 * 1000);
