const express = require('express');
const cors = require('cors');
const pool = require('./models/db'); // connexion à ta BDD

const app = express();
const port = 4000;

// ✅ CORS avec origine autorisée
app.use(cors({
  origin: 'http://localhost:3000' // ← correspond à React
}));
app.use(express.json());


// Simple API key check middleware
const API_KEY = 'my_secret_key';

app.use((req, res, next) => {
  const key = req.query.key;
  if (!key || key !== API_KEY) {
    return res.status(401).json({ code: '11111', message: 'erreur d identification', resultat: 'ERROR' });
  }
  next();
});
app.get('/list-commandes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM commandes');
    return res.json({
      code: '00000',
      message: 'Succès',
      resultat: 'OK',
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching commandes', err);
    return res.status(500).json({ code: '00003', message: 'Erreur serveur', resultat: 'ERROR' });
  }
});

// Route to add a new commande
app.post('/add-commande', async (req, res) => {
  const { source, id_commande_externe, contenu, statut } = req.body;

  if (!source || !id_commande_externe || !contenu || !statut) {
    return res.status(400).json({ code: '00001', message: 'Paramètres manquants', resultat: 'ERROR' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO commandes (source, id_commande_externe, contenu, statut) VALUES ($1, $2, $3, $4) RETURNING *',
      [source, id_commande_externe, JSON.stringify(contenu), statut]
    );

    return res.json({
      code: '00000',
      message: 'Commande ajoutée avec succès',
      resultat: 'OK',
      data: result.rows[0], // Return the newly added order
    });
  } catch (err) {
    console.error('Error adding commande', err);
    return res.status(500).json({ code: '00003', message: 'Erreur serveur', resultat: 'ERROR' });
  }
});
// Supprimer une commande par id
app.delete('/delete-commande/:id', async (req, res) => {
  const id = req.params.id;
  const key = req.query.key;

  if (key !== 'my_secret_key') {
    return res.status(401).json({ code: '11111', message: 'erreur d identification', resultat: 'ERROR' });
  }

  try {
    await pool.query('DELETE FROM commandes WHERE id = $1', [id]);
    res.json({ code: '00000', message: 'Commande supprimée avec succès', resultat: 'OK' });
  } catch (err) {
    console.error('Erreur suppression commande:', err);
    res.status(500).json({ code: '00003', message: 'Erreur serveur', resultat: 'ERROR' });
  }
});

// Modifier une commande (PUT)
app.put('/update-commande/:id', async (req, res) => {
  const { id } = req.params;
  const { source, id_commande_externe, contenu, statut } = req.body;
  try {
    const result = await pool.query(
      'UPDATE commandes SET source = $1, id_commande_externe = $2, contenu = $3, statut = $4 WHERE id = $5 RETURNING *',
      [source, id_commande_externe, JSON.stringify(contenu), statut, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ code: '00002', message: 'Commande non trouvée', resultat: 'ERROR' });
    }
    res.json({ code: '00000', message: 'Commande modifiée', resultat: 'OK', data: result.rows[0] });
  } catch (err) {
    console.error('Erreur modification:', err);
    res.status(500).json({ code: '00003', message: 'Erreur serveur', resultat: 'ERROR' });
  }
});
// Route to get order details from database
app.get('/APITICKET', async (req, res) => {
  const { methode, id_commande } = req.query;

  console.log(`Received request with id_commande: ${id_commande}`);  // Debugging log

  if (methode === 'details_commande' && id_commande) {
    try {
      // Query to fetch order from the database
      const result = await pool.query('SELECT * FROM commandes WHERE id_commande_externe = $1', [id_commande]);

      console.log('Database query result:', result.rows);  // Debugging log

      if (result.rows.length > 0) {
        // If the order is found, return it
        const orderData = result.rows[0]; // Assuming the first row is the desired one
        return res.json({
          code: '00000',
          message: 'Succès',
          resultat: 'OK',
          data: orderData, // Return real order data
        });
      } else {
        return res.status(404).json({ code: '00002', message: 'Commande non trouvée', resultat: 'ERROR' });
      }
    } catch (err) {
      console.error('Error during database query:', err);
      return res.status(500).json({ code: '00003', message: 'Erreur serveur', resultat: 'ERROR' });
    }
  }

  return res.status(400).json({ code: '00001', message: 'Paramètres invalides', resultat: 'ERROR' });
});

app.listen(port, () => {
  console.log(`Pizza-demo API running at http://localhost:${port}`);
});
