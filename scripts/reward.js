require('dotenv').config();
const { Web3 } = require('web3');
const axios = require('axios');

// Import ThermCoin.json for the ABI
const ThermCoin = require('./ThermCoin.json');

// Load environment variables
const {
    NETWORK_URL,
    GENESIS_WALLET_PRIV_KEY,
    THERMCOIN_CONTRACT_ADDR,
    POOL_BACKEND_URL
} = process.env;

console.log("NETWORK_URL: ", NETWORK_URL);
console.log("GENESIS_WALLET_PRIV_KEY: ", GENESIS_WALLET_PRIV_KEY);
console.log("THERMCOIN_CONTRACT_ADDR: ", THERMCOIN_CONTRACT_ADDR);
console.log("POOL_BACKEND_URL: ", POOL_BACKEND_URL);

// Initialize web3 instance
const web3 = new Web3(NETWORK_URL);

// ERC20 Token ABI 
const tokenABI = ThermCoin.abi;

// Contract instance
const tokenContract = new web3.eth.Contract(tokenABI, THERMCOIN_CONTRACT_ADDR);

const rewardAmt = '1';

// Function to distribute tokens in batches
async function distributeTokensBatch(recipients, amount, batchSize) {
    // Create account object from private key
    const account = web3.eth.accounts.privateKeyToAccount(GENESIS_WALLET_PRIV_KEY);
    console.log(account); // Temporarily for debugging

    for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        console.log("Calling distributeReward()...");
        // console.log("Estimated gas: ", await tokenContract.methods.distributeReward(batch, web3.utils.toWei(amount.toString(), 'ether'), 0, batch.length).estimateGas({ from: account.address }) * (BigInt(2)));
        const tx = {
            from: account.address,
            to: THERMCOIN_CONTRACT_ADDR,
            data: tokenContract.methods.distributeReward(batch, web3.utils.toWei(amount.toString(), 'ether'), 0, batch.length).encodeABI(),
            gas: gasLimit.toString(16),
            gasPrice: '0x0',
        };

        await web3.eth.accounts.signTransaction(tx, GENESIS_WALLET_PRIV_KEY)
            .then(signedTx => web3.eth.sendSignedTransaction(signedTx.rawTransaction));
        console.log(`Tokens distributed to batch starting at index ${i}`);
        console.log("Rewarded miners: ", batch);
    }
}

async function getPeers() {
    try {
        const peers = await web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'admin_peers',
            params: [],
            id: new Date().getTime()
        });

        console.log(peers.result);
    } catch (error) {
        console.error('Error fetching peers:', error);
    }
}

async function fetchRegisteredMiners() {
    try {
        const response = await axios.get(POOL_BACKEND_URL);
        const miners = response.data.data;

        return miners;
    } catch (error) {
        console.error('Error fetching registered miners:', error);
    }
}

// Function to get miners list and distribute tokens
async function distributeTokens() {
    try {
        const miners = await fetchRegisteredMiners();
        console.log("Fetching miners: ", miners);
        const minerAddresses = miners.map(miner => miner.wallet_address);
        console.log("Retreiving miner addresses: ", minerAddresses);
        const batchSize = 50;
        console.log("Batch size: ", batchSize);
        await distributeTokensBatch(minerAddresses, rewardAmt, batchSize);
    } catch (error) {
        console.error('Error in distributing tokens:', error);
    }
}

// TBD
// // Function to subscribe to new block headers
// function listenForBlocks() {
//     web3.eth.subscribe('newBlockHeaders', async (error, blockHeader) => {
//         if (error) {
//             console.error('Error in block header subscription:', error);
//             return;
//         }

//         console.log(`New block detected: ${blockHeader.number}, distributing tokens...`);
//         await distributeTokens(blockHeader.number);
//     });
// }

// listenForBlocks();

console.log("Distributing tokens in 2 seconds...")
setInterval(distributeTokens, 2000);
