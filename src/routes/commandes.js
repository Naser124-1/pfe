const express = require('express');
const router = express.Router();
const { getDetailsCommandePizzaDemo } = require('../services/apiPizzaDemo');

router.get('/pizza-demo/:id', async (req, res) => {
  const id_commande = req.params.id;
  const data = await getDetailsCommandePizzaDemo(id_commande);
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Erreur récupération commande pizza-demo' });
  }
});

module.exports = router;
