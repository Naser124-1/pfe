import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function CreateCommandeModal({ show, handleClose, onCreate }) {
  const [source, setSource] = useState('');
  const [idExterne, setIdExterne] = useState('');
  const [pizza, setPizza] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [statut, setStatut] = useState('En préparation');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCommande = {
      source,
      id_commande_externe: idExterne,
      contenu: { pizza, quantity: parseInt(quantity) },
      statut,
    };

    try {
      // Récupération du token JWT stocké dans localStorage
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:4000/add-commande', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,  // <-- Ici on ajoute le token JWT
        },
        body: JSON.stringify(newCommande),
      });

      const data = await res.json();

      if (data.code === '00000') {
        setError(null);
        onCreate();    // Indique au parent de rafraîchir la liste
        handleClose(); // Ferme la modal
      } else {
        setError(data.message);
      }
    } catch {
      setError('Erreur de connexion');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Créer une nouvelle commande</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formSource">
            <Form.Label>Source</Form.Label>
            <Form.Control type="text" value={source} onChange={e => setSource(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formIdExterne">
            <Form.Label>ID Externe</Form.Label>
            <Form.Control type="text" value={idExterne} onChange={e => setIdExterne(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPizza">
            <Form.Label>Pizza</Form.Label>
            <Form.Control type="text" value={pizza} onChange={e => setPizza(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formQuantity">
            <Form.Label>Quantité</Form.Label>
            <Form.Control type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formStatut">
            <Form.Label>Statut</Form.Label>
            <Form.Select value={statut} onChange={e => setStatut(e.target.value)}>
              <option>En préparation</option>
              <option>En livraison</option>
              <option>Terminée</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">Créer la commande</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateCommandeModal;
