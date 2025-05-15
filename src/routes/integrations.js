const express = require('express');
const router = express.Router();
const { addCommandeFromIntegration } = require('../services/apiPizzaDemo');

router.post('/ubereats/order', async (req, res) => {
  try {
    const saved = await addCommandeFromIntegration(req.body);
    res.json({ code: '00000', message: 'Commande reçue', data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: '00003', message: 'Erreur serveur' });
  }
});

module.exports = router;
