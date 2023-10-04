const db = require('../db/init');

class Miner {
    static create(node_id, wallet_address, callback) {
        db.run(`INSERT INTO miners (node_id, wallet_address) VALUES (?, ?)`, [node_id, wallet_address], callback);
    }

    static findByNodeId(node_id, callback) {
        db.get(`SELECT * FROM miners WHERE node_id = ?`, [node_id], callback);
    }

    static deleteByNodeId(node_id, callback) {
        db.run(`DELETE FROM miners WHERE node_id = ?`, [node_id], callback);
    }

    static updateWalletByNodeId(node_id, new_wallet_address, callback) {
        db.run(`UPDATE miners SET wallet_address = ? WHERE node_id = ?`, [new_wallet_address, node_id], callback);
    }

    static getAll(callback) {
        db.all(`SELECT * FROM miners`, callback);
    }

    static clearDB(callback) {
        db.run(`DELETE FROM miners`, callback);
    }
}

module.exports = Miner;