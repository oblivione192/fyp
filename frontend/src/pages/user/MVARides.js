import React from "react"; 
import { Button } from "react-bootstrap";
//must able to show ride history and upcoming rides 
//ability to book ride in advanced for an appointment   
import { useNavigate } from "react-router-dom";
function RideHistory(){ 
      
}
export default function RidesPage(){  
     const navigate = useNavigate(); 
     const backHome =  ()=>{navigate('/home')} 
     return( 
          <Button style={{ 
              width:'20rem',
              marginTop:'1rem'
          }}  
           onClick={backHome}
          >Back
          </Button>
     )
}