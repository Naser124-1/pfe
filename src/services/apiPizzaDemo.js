const pool = require('../models/db');

async function getAllCommandes() {
  const result = await pool.query('SELECT * FROM commandes ORDER BY id DESC');
  return result.rows;
}

async function addCommande(data) {
  const { source, id_commande_externe, contenu, statut } = data;
  const contenuStr = typeof contenu === 'string' ? contenu : JSON.stringify(contenu);
  const result = await pool.query(
    'INSERT INTO commandes (source, id_commande_externe, contenu, statut) VALUES ($1, $2, $3, $4) RETURNING *',
    [source, id_commande_externe, contenuStr, statut]
  );
  return result.rows[0];
}

async function updateCommande(id, data) {
  const { source, id_commande_externe, contenu, statut } = data;
  const contenuStr = typeof contenu === 'string' ? contenu : JSON.stringify(contenu);
  const result = await pool.query(
    'UPDATE commandes SET source = $1, id_commande_externe = $2, contenu = $3, statut = $4 WHERE id = $5 RETURNING *',
    [source, id_commande_externe, contenuStr, statut, id]
  );
  return result.rows[0];
}

async function deleteCommande(id) {
  await pool.query('DELETE FROM commandes WHERE id = $1', [id]);
}

module.exports = {
  getAllCommandes,
  addCommande,
  updateCommande,
  deleteCommande,
};
