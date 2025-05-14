const axios = require('axios');

async function getDetailsCommandePizzaDemo(id_commande) {
  const url = `https://www.pizza-demo-v3.fr/APITICKET/?key=TA_CLE_API&id=2421&methode=details_commande&id_commande=${id_commande}`;
  try {
    const response = await axios.get(url);
    return response.data; // À adapter selon la structure reçue
  } catch (error) {
    console.error('Erreur API pizza-demo', error.message);
    return null;
  }
}

module.exports = { getDetailsCommandePizzaDemo };
