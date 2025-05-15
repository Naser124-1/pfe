const { Pool } = require('pg');

const pool = new Pool({
  user: 'your_pg_user',
  host: 'localhost',
  database: 'middleware_pfe_db',
  password: 'newpassword',
  port: 5432,
});

module.exports = pool;
