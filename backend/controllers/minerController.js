const Miner = require('../models/miner');

// Create a miner (node and wallet pair)
exports.create = (req, res) => {
    const { node_id, wallet_address } = req.body;

    Miner.create(node_id, wallet_address, (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to register miner.' });
            return;
        }

        res.status(201).json({ message: 'Miner registered successfully.' });
    });
};

// Fetch miner by node_id
exports.findByNodeId = (req, res) => {
    const node_id = req.params.node_id;

    Miner.findByNodeId(node_id, (err, miner) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch miner.' });
            return;
        }

        if (!miner) {
            res.status(404).json({ error: 'Miner not found.' });
            return;
        }

        res.status(200).json(miner);
    });
};

// Delete a miner by node_id
exports.deleteByNodeId = (req, res) => {
    const node_id = req.params.node_id;

    Miner.deleteByNodeId(node_id, (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to delete miner.' });
            return;
        }

        res.status(200).json({ message: 'Miner deleted successfully.' });
    });
};

// Update wallet address by node_id
exports.updateWalletByNodeId = (req, res) => {
    const node_id = req.params.node_id;
    const { wallet_address } = req.body;

    Miner.updateWalletByNodeId(node_id, wallet_address, (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to update wallet address.' });
            return;
        }

        res.status(200).json({ message: 'Wallet address updated successfully.' });
    });
};

// Fetch all miners
exports.getAll = (req, res) => {
    Miner.getAll((err, miners) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch miners.' });
            return;
        }

        res.status(200).json(miners);
    });
};