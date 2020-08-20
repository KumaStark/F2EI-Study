const dbconn = require("mysql2");
const databaseSettings = require("../settings/database.json");

let instance = null;
module.exports = function () {
  if (!instance) {
    instance = dbconn.createPool(databaseSettings);
  }
  return instance;
};