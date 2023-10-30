const sqlite = require('better-sqlite3');
const path = require('path');

function initDatabase(dbPath) {
    // Initialize the database
    if(dbPath == undefined) {
        console.error('DB path is undefined');
    }
    
    const db = new sqlite(path.resolve(dbPath));

    // Define table schema and create it
    const createTableSQL = `
    CREATE TABLE IF NOT EXISTS miners (
        id INTEGER PRIMARY KEY,
        node_id TEXT UNIQUE,
        wallet_address TEXT NOT NULL
    );
    `;

    db.exec(createTableSQL);

    // Close the database
    db.close();
}

function clearDatabase(dbPath) {
    // Initialize the database
    if(dbPath == undefined) {
        console.error('DB path is undefined');
    }
    
    const db = new sqlite(path.resolve(dbPath));

    // Define table schema and create it
    const dropTableSQL = `
    DROP TABLE IF EXISTS miners;
    `;

    db.exec(dropTableSQL);

    // Close the database
    db.close();
}

function insertDummyData(dbPath) {
    // Initialize the database
    if(dbPath == undefined) {
        console.error('DB path is undefined');
    }
    
    const db = new sqlite(path.resolve(dbPath));

    // Insert dummy data
    const insertDummyDataSQL = `
    INSERT INTO miners (node_id, wallet_address)
    VALUES
        ('d2c37664c252655e3da74bdec9b0fb37d5a4f63252d64f7c7e0eb58b2af6d8a4', '0x9a7d2759f742d6b7a1d5a3376b12b534fa04e375'),
        ('85718f68d33eeafcb9ce8a647fbddfdccd6a3a9a5483b5342d463446814040f2', '0xb5a8ef84c3e5d3e31b340342b5d33a5de5a488b5'),
        ('ea9357c28c73b0dd5916f5e3d7a3fafea1a2aedc3a3123b7bf7aef0a2ae87a33', '0x0b4cf5a5c8475a732fae319b3456dc59d4d4abf7'),
        ('cc1be0a288beb0f1c6b95bc5c75b3126153f2bb8fe3003e7c3e28e441e546f8d', '0xa5b9d32f2c5f0875dcca42c6931b5e587b2a7c29');
    `;

    try {
        db.exec(insertDummyDataSQL);
    } catch (err) {
        console.warn('Db write error:', err.message);
    }

    // Close the database
    db.close();
}

module.exports = {
    initDatabase,
    clearDatabase,
    insertDummyData
};