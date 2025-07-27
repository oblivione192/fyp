import { Modal, Button, Form } from 'react-bootstrap'; 
function PopupForm({ title, showModal, onClose, children, submitHandler }) {
  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {children}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={() => {
          submitHandler?.();
          onClose();
        }}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PopupForm;
