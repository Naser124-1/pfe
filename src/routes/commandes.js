const express = require('express');
const router = express.Router();
const { listCommandes, createCommande, updateCommande, deleteCommande } = require('../controllers/commandes');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, listCommandes);

// Only admin can create, update, delete
router.post('/', authMiddleware, adminMiddleware, createCommande);
router.put('/:id', authMiddleware, adminMiddleware, updateCommande);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCommande);

module.exports = router;
