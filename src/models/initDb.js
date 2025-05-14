const pool = require('./db');

async function createTables() {
  const createCommandesTable = `
    CREATE TABLE IF NOT EXISTS commandes (
      id SERIAL PRIMARY KEY,
      source VARCHAR(100),
      id_commande_externe VARCHAR(100),
      contenu JSONB,
      statut VARCHAR(50),
      date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createCommandesTable);
    console.log('Table commandes créée ou existante');
  } catch (error) {
    console.error('Erreur création table commandes', error);
  } finally {
    await pool.end();
  }
}

createTables();
