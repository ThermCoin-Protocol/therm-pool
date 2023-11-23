const sqlite = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const dbUtil = require('./db-util');

function getDB() {
  if (process.env.NODE_ENV == 'test') {
    const db = new sqlite(path.resolve('pool-test.db'), { fileMustExist: true });
    return db;
  } else {
    if (!fs.existsSync('pool.db')) {
      dbUtil.initDatabase('pool.db');
      dbUtil.insertData('pool.db');
    }
    const db = new sqlite(path.resolve('pool.db'), { fileMustExist: true });
    return db;
  }
}


function query(sql, params) {
  const db = getDB();
  return db.prepare(sql).all(params);
}

function run(sql, params) {
  const db = getDB();
  return db.prepare(sql).run(params);
}

module.exports = {
  query,
  run
}
