
import { Modal, Button } from 'react-bootstrap';

export default function OnFailureModal({ show, title, message, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>{title || 'Operation Failed'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{message || 'Something went wrong. Please try again later.'}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
