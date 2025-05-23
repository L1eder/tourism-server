const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "attractions_db",
  password: "406895081",
  port: 5432,
});

module.exports = pool;
