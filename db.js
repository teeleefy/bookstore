/** Database config for database. */
const { Client } = require("pg");
const { db } = require("./config");


let client = new Client({
  host: '/var/run/postgresql',
  database: db,
})

client.connect();

module.exports = client;
