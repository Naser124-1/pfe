const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
  user: 'postgres',           // Your PostgreSQL username
  host: 'localhost',
  database: 'middleware_pfe_db', // Your database name
  password: 'newpassword',  // Your PostgreSQL password
  port: 5432,
});

module.exports = pool;
