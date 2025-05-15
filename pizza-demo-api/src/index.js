const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const pool = require('./models/db'); // connexion à ta BDD

const app = express();
const port = 4000;

const JWT_SECRET = 'ta_cle_super_secrete_a_changer';

app.use(cors({
  origin: 'http://localhost:3000' // Ton frontend React
}));

app.use(express.json());

// --- Routes Auth ---
async function generateHash() {
  const hash = await bcrypt.hash('admin123', 10); // mot de passe admin123
  console.log(hash);
}

generateHash();

// Inscription (role par défaut = 'user')
app.post('/auth/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
      [email, password_hash, 'user']
    );
    res.json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Connexion - renvoie token avec rôle
app.post('/auth/login', [
  body('email').isEmail(),
  body('password').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// --- Middleware JWT ---
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });

jwt.verify(token, JWT_SECRET, (err, user) => {
  if (err) return res.status(403).json({ message: 'Token invalide' });
  console.log('Middleware auth user:', user); // <== debug ici
  req.user = user;
  next();
});
}

// Middleware admin seulement
function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé, admin seulement' });
  }
  next();
}

// --- Routes CRUD ---

// Tous les utilisateurs connectés peuvent voir la liste
app.get('/list-commandes', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM commandes ORDER BY id DESC');
    res.json({
      code: '00000',
      message: 'Succès',
      resultat: 'OK',
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching commandes', err);
    res.status(500).json({ code: '00003', message: 'Erreur serveur', resultat: 'ERROR' });
  }
});

// Seuls les admins peuvent créer
app.post('/add-commande', authMiddleware, adminMiddleware, async (req, res) => {
  const { source, id_commande_externe, contenu, statut } = req.body;
  if (!source || !id_commande_externe || !contenu || !statut) {
    return res.status(400).json({ code: '00001', message: 'Paramètres manquants', resultat: 'ERROR' });
  }
  try {
    const contenuString = typeof contenu === 'string' ? contenu : JSON.stringify(contenu);
    const result = await pool.query(
      'INSERT INTO commandes (source, id_commande_externe, contenu, statut) VALUES ($1, $2, $3, $4) RETURNING *',
      [source, id_commande_externe, contenuString, statut]
    );
    res.json({
      code: '00000',
      message: 'Commande ajoutée avec succès',
      resultat: 'OK',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error adding commande', err);
    res.status(500).json({ code: '00003', message: 'Erreur serveur', resultat: 'ERROR' });
  }
});

// Seuls les admins peuvent supprimer
app.delete('/delete-commande/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM commandes WHERE id = $1', [id]);
    res.json({ code: '00000', message: 'Commande supprimée avec succès', resultat: 'OK' });
  } catch (err) {
    console.error('Erreur suppression commande:', err);
    res.status(500).json({ code: '00003', message: 'Erreur serveur', resultat: 'ERROR' });
  }
});

// Seuls les admins peuvent modifier
app.put('/update-commande/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { source, id_commande_externe, contenu, statut } = req.body;
  try {
    const contenuString = typeof contenu === 'string' ? contenu : JSON.stringify(contenu);
    const result = await pool.query(
      'UPDATE commandes SET source = $1, id_commande_externe = $2, contenu = $3, statut = $4 WHERE id = $5 RETURNING *',
      [source, id_commande_externe, contenuString, statut, id]
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

app.listen(port, () => {
  console.log(`Pizza-demo API running at http://localhost:${port}`);
});
