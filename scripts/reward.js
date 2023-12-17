require('dotenv').config();
const { Web3 } = require('web3');
const IpcProvider = require('web3-providers-ipc').IpcProvider;

const net = require('net');
const axios = require('axios');

// Import ThermCoin.json for the ABI
const ThermCoin = require('./ThermCoin.json');

// Load environment variables
const {
    NETWORK_URL,
    GENESIS_WALLET_PRIV_KEY,
    THERMCOIN_CONTRACT_ADDR,
    POOL_BACKEND_URL,
    IPC_PATH
} = process.env;

console.log("NETWORK_URL: ", NETWORK_URL);
console.log("GENESIS_WALLET_PRIV_KEY: ", GENESIS_WALLET_PRIV_KEY);
console.log("THERMCOIN_CONTRACT_ADDR: ", THERMCOIN_CONTRACT_ADDR);
console.log("POOL_BACKEND_URL: ", POOL_BACKEND_URL);
console.log("IPC_PATH: ", IPC_PATH);

// Initialize web3 instance
const web3 = new Web3(NETWORK_URL);

// Web3 instance for IPC
const web3IPC = new Web3(new IpcProvider(IPC_PATH, net));

// ERC20 Token ABI 
const tokenABI = ThermCoin.abi;

// Contract instance
const tokenContract = new web3.eth.Contract(tokenABI, THERMCOIN_CONTRACT_ADDR);

const rewardDecayFactor = 0.0000001;

// Function to distribute tokens in batches
async function distributeTokensBatch(recipients, amount, batchSize) {
    // Create account object from private key
    const account = web3.eth.accounts.privateKeyToAccount(GENESIS_WALLET_PRIV_KEY);
    console.log(account); // Temporarily for debugging

    for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        console.log("Calling distributeReward()...");
        const currentNonce = await web3.eth.getTransactionCount(account.address, 'pending');
        const tx = {
            from: account.address,
            to: THERMCOIN_CONTRACT_ADDR,
            data: tokenContract.methods.distributeReward(batch, web3.utils.toWei(amount.toString(), 'ether'), 0, batch.length).encodeABI(),
            gas: 100000,
            gasPrice: '0x100',
            nonce: web3.utils.toHex(currentNonce + BigInt(i)),
        };

        await web3.eth.accounts.signTransaction(tx, GENESIS_WALLET_PRIV_KEY)
            .then(signedTx => web3.eth.sendSignedTransaction(signedTx.rawTransaction));
        console.log(`Tokens distributed to batch starting at index ${i}`);
        console.log("Rewarded miners: ", batch);
    }
}

async function getPeers() {
    try {
        const peers = await web3IPC.currentProvider.request({
            method: 'admin_peers',
            params: [],
            id: new Date().getTime()
        });

        console.log("Peers: ", peers);
        return peers.result.map(peer => peer.enode.split('@')[0]);
    } catch (error) {
        console.error('Error fetching peers:', error);
        return [];
    }
}

async function verifyMiners(miners) {
    const peerNodeIds = await getPeers();
    return miners.filter(miner => peerNodeIds.includes(miner.node_id));
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
        const verifiedMiners = await verifyMiners(miners);
        console.log("Verified miners: ", verifiedMiners);
        const batchSize = 50;
        console.log("Batch size: ", batchSize);
        const account = web3.eth.accounts.privateKeyToAccount(GENESIS_WALLET_PRIV_KEY);
        const accountTokenBalance = web3.utils.fromWei(await tokenContract.methods.balanceOf(account.address).call(), 'ether');
        console.log("Core wallet BTUC balance: ", accountTokenBalance);
        const blockReward = accountTokenBalance * rewardDecayFactor;
        console.log("Total block reward: ", blockReward);
        const rewardAmt = Math.floor(blockReward / minerAddresses.length);
        console.log("Reward per miner: ", rewardAmt);
        await distributeTokensBatch(minerAddresses, rewardAmt, batchSize);
    } catch (error) {
        console.error('Error in distributing tokens:', error);
    }
    // } finally {
    //     setTimeout(distributeTokens, 2000);
    // }
}

async function listenForBlocks() {
    let lastProcessedBlock = 0;
    let isProcessing = false;

    const processBlocks = async () => {
        try {
            const currentBlock = await web3IPC.eth.getBlockNumber();
            if (currentBlock > lastProcessedBlock) {
                for (let blockNumber = lastProcessedBlock + 1; blockNumber <= currentBlock; blockNumber++) {
                    if (isProcessing) {
                        console.log(`Block ${blockNumber} received but still processing the previous block.`);
                        return;
                    }

                    isProcessing = true;
                    console.log(`Processing block number: ${blockNumber}`);

                    try {
                        await distributeTokens(blockNumber);
                        console.log(`Processed block number: ${blockNumber}`);
                    } catch (err) {
                        console.error(`Error in processing block number ${blockNumber}:`, err);
                    } finally {
                        isProcessing = false;
                    }
                }
                lastProcessedBlock = currentBlock;
            }
        } catch (error) {
            console.error('Error in processing blocks:', error);
        }
    };

    setInterval(processBlocks, 1000); // Poll every 1 seconds
}

listenForBlocks();