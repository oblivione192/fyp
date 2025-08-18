// components/OnNetworkFailureModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function OnNetworkFailureModal({ show, title, message, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>{title || 'Network Error'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{message || 'A network error occurred. Please check your connection and try again.'}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Retry
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
