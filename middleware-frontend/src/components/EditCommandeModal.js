import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  animation: 'fadeIn 0.3s ease'
};

const modalStyle = {
  backgroundColor: '#fff',
  borderRadius: '10px',
  padding: '20px',
  width: '350px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
  animation: 'slideDown 0.3s ease',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  margin: '6px 0 12px 0',
  borderRadius: '5px',
  border: '1px solid #ccc',
  boxSizing: 'border-box',
};

const buttonPrimary = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 15px',
  marginRight: '10px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const buttonSecondary = {
  backgroundColor: '#f44336',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

function EditModal({ commande, onClose, onSave }) {
  const [source, setSource] = useState('');
  const [idExterne, setIdExterne] = useState('');
  const [pizza, setPizza] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [statut, setStatut] = useState('');

  useEffect(() => {
    if (commande) {
      setSource(commande.source);
      setIdExterne(commande.id_commande_externe);
      setPizza(commande.contenu.pizza);
      setQuantity(commande.contenu.quantity);
      setStatut(commande.statut);
    }
  }, [commande]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: commande.id,
      source,
      id_commande_externe: idExterne,
      contenu: { pizza, quantity },
      statut,
      date_commande: commande.date_commande,
    });
  };
 return (
    <Modal show={!!commande} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier la commande ID {commande?.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Source</Form.Label>
            <Form.Control
              type="text"
              value={source}
              onChange={e => setSource(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ID Externe</Form.Label>
            <Form.Control
              type="text"
              value={idExterne}
              onChange={e => setIdExterne(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Pizza</Form.Label>
            <Form.Control
              type="text"
              value={pizza}
              onChange={e => setPizza(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantité</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(parseInt(e.target.value))}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Statut</Form.Label>
            <Form.Select
              value={statut}
              onChange={e => setStatut(e.target.value)}
            >
              <option>En préparation</option>
              <option>En livraison</option>
              <option>Terminée</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">
            💾 Sauvegarder
          </Button>{' '}
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}


export default EditModal;
