import React from 'react';
import { useNavigate } from 'react-router-dom';

function MiddlewareDashboard() {
  const navigate = useNavigate();

  const goToApiFront = () => {
    navigate('/api'); // Route vers le frontend pizza-demo (API front)
  };

  return (
    <div className="container mt-4">
      <h1>Dashboard Middleware</h1>
      <p>Bienvenue dans le middleware. Voici un tableau de bord minimaliste.</p>

      {/* Bouton pour accéder au frontend API pizza-demo */}
      <button className="btn btn-primary" onClick={goToApiFront}>
        Accéder au Frontend API Pizza-Demo
      </button>

      {/* Zone pour afficher des logs ou infos monitoring (exemple statique) */}
      <div style={{ marginTop: '20px' }}>
        <h3>Informations système</h3>
        <ul>
          <li>Nombre de commandes totales : -- (à remplir dynamiquement)</li>
          <li>Statut API : OK</li>
          <li>Dernière synchronisation : --</li>
        </ul>
      </div>
    </div>
  );
}

export default MiddlewareDashboard;
