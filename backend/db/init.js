const sqlite3 = require('sqlite3').verbose();
const config = require('../config/config.json');

const db = new sqlite3.Database(config.dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS miners (node_id TEXT UNIQUE, wallet_address TEXT)`);
});

module.exports = db;