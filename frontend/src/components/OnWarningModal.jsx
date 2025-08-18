import { Modal, Button } from "react-bootstrap";
import { LuBadgeAlert } from "react-icons/lu";
export default function OnWarningModal({ 
  title = "Warning", 
  message = "Are you sure you want to proceed?", 
  show, 
  positiveHandler, 
  negativeHandler, 
  onClose 
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton> 
        <LuBadgeAlert style={{height:'128px',width:'128px',color:'red'}}/>
        <Modal.Title className="text-warning">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={negativeHandler}>
          Cancel
        </Button>
        <Button variant="warning" onClick={()=>{positiveHandler();onClose()}}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
}