const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',           // ton utilisateur PostgreSQL
  host: 'localhost',
  database: 'middleware_pfe_db', // ta base créée
  password: 'newpassword',        // ton mot de passe PostgreSQL
  port: 5432,
});

module.exports = pool;
