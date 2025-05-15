import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  // Import nommé, pas default

import ConfirmModal from './components/ConfirmModal';
import EditModal from './components/EditCommandeModal';
import CreateCommandeModal from './components/CreateCommandeModal';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  // États
  const [commandes, setCommandes] = useState([]);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editingCommande, setEditingCommande] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' ou 'user'

  const itemsPerPage = 10;

  // Au démarrage, on vérifie si un token valide est stocké
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    }
  }, []);

  // Récupération des commandes au login
  useEffect(() => {
    if (isLoggedIn) fetchCommandes();
  }, [isLoggedIn]);

  // Reset page quand la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
    setCommandes([]);
    setError(null);
    setCurrentPage(1);
  };

  // Récupération des commandes
  const fetchCommandes = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Non authentifié');
      setCommandes([]);
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/list-commandes', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) throw new Error('Erreur API: ' + res.status);
      const data = await res.json();
      setCommandes(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setCommandes([]);
      if (err.message.includes('401') || err.message.includes('403')) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtrage
  const filteredCommandes = commandes.filter(cmd => {
    const term = searchTerm.toLowerCase();
    return (
      cmd.source.toLowerCase().includes(term) ||
      (cmd.contenu.pizza && cmd.contenu.pizza.toLowerCase().includes(term)) ||
      cmd.statut.toLowerCase().includes(term)
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommandes = filteredCommandes.slice(indexOfFirstItem, indexOfLastItem);

  // Supprimer
  const askDelete = id => setConfirmDeleteId(id);
  const cancelDelete = () => setConfirmDeleteId(null);

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/delete-commande/${confirmDeleteId}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) throw new Error('Erreur suppression');
      setConfirmDeleteId(null);
      fetchCommandes();
    } catch (err) {
      alert('Erreur lors de la suppression : ' + err.message);
    }
  };

  // Éditer
  const startEditing = cmd => setEditingCommande(cmd);
  const cancelEditing = () => setEditingCommande(null);

  const saveEditing = async updated => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/update-commande/${updated.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.code === '00000') {
        alert('Commande modifiée');
        setEditingCommande(null);
        fetchCommandes();
      } else {
        alert('Erreur modification : ' + data.message);
      }
    } catch {
      alert('Erreur de connexion');
    }
  };

  // Affichage Login ou Register si pas connecté
  if (!isLoggedIn) {
    if (showRegister) {
      return <Register onRegister={() => setShowRegister(false)} />;
    }
    return (
      <Login
        onLogin={() => {
          setIsLoggedIn(true);
          fetchCommandes();
        }}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  // Interface principale
  return (
    <div className="container mt-4">
      <h1 className="mb-4">🧾 Liste des Commandes</h1>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-danger" onClick={handleLogout}>
          🔓 Déconnexion
        </button>
        <span>
          Rôle connecté : <strong>{userRole}</strong>
        </span>
      </div>

      {userRole === 'admin' && (
        <button className="btn btn-success mb-3" onClick={() => setShowCreateModal(true)}>
          ➕ Créer une commande
        </button>
      )}

      <CreateCommandeModal show={showCreateModal} handleClose={() => setShowCreateModal(false)} onCreate={fetchCommandes} />

      <button className="btn btn-primary mb-3" onClick={fetchCommandes}>
        🔄 Recharger la liste
      </button>

      {error && <p className="text-danger">Erreur : {error}</p>}

      <ConfirmModal isOpen={confirmDeleteId !== null} message="Voulez-vous vraiment supprimer cette commande ?" onConfirm={confirmDelete} onCancel={cancelDelete} />

      {editingCommande && <EditModal commande={editingCommande} onClose={cancelEditing} onSave={saveEditing} />}

      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      )}

      <input type="text" className="form-control mb-3" placeholder="Rechercher par source, pizza ou statut..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

      <table className="table table-striped table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Source</th>
            <th>Contenu</th>
            <th>Statut</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCommandes.map(cmd => (
            <tr key={cmd.id}>
              <td>{cmd.id}</td>
              <td>{cmd.source}</td>
              <td>
                <div>
                  <div>Pizza : {cmd.contenu.pizza || 'N/A'}</div>
                  <div>Quantité : {cmd.contenu.quantity || 'N/A'}</div>
                </div>
              </td>
              <td>{cmd.statut}</td>
              <td>{new Date(cmd.date_commande).toLocaleString()}</td>
              <td>
                {userRole === 'admin' && (
                  <>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => startEditing(cmd)}>
                      ✏️ Modifier
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => askDelete(cmd.id)}>
                      🗑️ Supprimer
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav>
        <ul className="pagination justify-content-center">
          {[...Array(Math.ceil(filteredCommandes.length / itemsPerPage)).keys()].map(number => (
            <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(number + 1)}>{number + 1}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default App;
