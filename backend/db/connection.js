const fs = require('fs');

const readDatabase = () => {
  const data = fs.readFileSync('db.json', 'utf8');
  return JSON.parse(data);
};

const writeDatabase = (data) => {
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync('db.json', json, 'utf8');
};

module.exports = {
  readDatabase,
  writeDatabase
};