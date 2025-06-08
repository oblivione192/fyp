import { Modal, Button, Form } from 'react-bootstrap';
function PopupForm({ title,show, setShowModal, children, submitHandler }) { 

  const handleClose = () => setShowModal(false);
  return (
    <Modal show={show} onHide={handleClose} >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form> 
          {children}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={()=>{submitHandler();handleClose()}}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PopupForm;
