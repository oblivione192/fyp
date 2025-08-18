// components/OnSuccessModal.js
import { Modal, Button } from 'react-bootstrap';

export default function OnSuccessModal({ show, title, message, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>{title || 'Success'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{message || 'Operation completed successfully.'}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="success" onClick={onClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}