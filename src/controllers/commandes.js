const apiPizzaDemo = require('../services/apiPizzaDemo');

async function listCommandes(req, res) {
  try {
    const commandes = await apiPizzaDemo.getAllCommandes();
    res.json({ code: '00000', message: 'Succès', resultat: 'OK', data: commandes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: '00003', message: 'Erreur serveur', resultat: 'ERROR' });
  }
}

async function createCommande(req, res) {
  try {
    const newCommande = await apiPizzaDemo.addCommande(req.body);
    res.json({ code: '00000', message: 'Commande ajoutée', resultat: 'OK', data: newCommande });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: '00003', message: 'Erreur serveur', resultat: 'ERROR' });
  }
}

async function updateCommande(req, res) {
  try {
    const updated = await apiPizzaDemo.updateCommande(req.params.id, req.body);
    if (!updated) return res.status(404).json({ code: '00002', message: 'Commande non trouvée', resultat: 'ERROR' });
    res.json({ code: '00000', message: 'Commande modifiée', resultat: 'OK', data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: '00003', message: 'Erreur serveur', resultat: 'ERROR' });
  }
}

async function deleteCommande(req, res) {
  try {
    await apiPizzaDemo.deleteCommande(req.params.id);
    res.json({ code: '00000', message: 'Commande supprimée', resultat: 'OK' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: '00003', message: 'Erreur serveur', resultat: 'ERROR' });
  }
}

module.exports = {
  listCommandes,
  createCommande,
  updateCommande,
  deleteCommande,
};
