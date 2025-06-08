import { Alert,Button } from "react-bootstrap";

function AlertMessage({title,show,body,negativeText,positiveText,
    positiveHandler,negativeHandler, setShow
}){  
    
    const handleClose = ()=> setShow(false); 
    
    return(
        <Alert show={show} variant="danger">
             <Alert.Heading>{title}</Alert.Heading> 
             <p>{body}</p>  
             <div style={{display:"flex"}}>
                <Button variant="danger" 
                 onClick={()=>{
                    positiveHandler(); 
                    handleClose();  
                 }
                  }
                >{positiveText}</Button> 
                <Button variant="success"
                  onClick={()=>{
                    negativeHandler(); 
                    handleClose(); 
                  }}
                >{negativeText}</Button>
             </div>
        </Alert>
    ) 
}
export default AlertMessage; 