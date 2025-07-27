import {Row,Col,Card, Button, FormControl,FormLabel, FormGroup, FormSelect, Table} from 'react-bootstrap';
import { IoMdCalendar } from 'react-icons/io'; 
import Calendar from 'react-calendar'; 
import { useEffect, useState, useRef} from 'react'; 
import API from '../../controllers';  
import PopupForm from '../../components/PopupForm';
function SlotAddingForm({showModal,onClose}){  
     const slotDate =  useRef(); 
     const startTime = useRef();
     const endTime = useRef(); 
     const addSlot = function(){ 
       
          API.getController('appointment').addClinicSlot({  
            slotDate: slotDate.current,
            startTime: startTime.current,
            endTime: endTime.current,
          }) 
          .then((status)=>{
             if(status === "OK"){
                 console.log("Success")
             }
          })
     } 
     return(
         <PopupForm  
           title="Add a Slot" 
           showModal={showModal} 
           onClose={()=>{onClose()}}
           submitHandler={(addSlot)} 
          > 
            <FormGroup>
               <FormLabel>Slot Date</FormLabel> 
               <FormControl type="date" 
                 min={new Date().toISOString().split('T')[0]}
                 onChange={(e)=>{
  
                     slotDate.current = e.target.value;  
                     console.log(slotDate.current); 
                 }}
                /> 
            </FormGroup> 
            <FormGroup>
               <FormLabel>Start Time</FormLabel> 
               <FormControl
                 type="time" 
                 onChange={(e)=>{
                    startTime.current=e.target.value; 
                 }}
               /> 
            </FormGroup> 
            <FormGroup>
                <FormLabel>End Time</FormLabel> 
                <FormControl 
                  type="time" 
                  onChange={(e)=>{
                      endTime.current= e.target.value
                  }}
                /> 
            </FormGroup>
         </PopupForm>
     )
}  
function SlotView(){ 
   
}
function ActionBar(){ 
     const [showModal, setShowModal] = useState(false);   
     return( 
         <div className="actionBar">
             <Button variant="success" onClick={()=>{setShowModal(true)}}>Add Slot</Button> 
             <Button variant="dark">Delete Slot</Button>    
             <SlotAddingForm showModal={showModal} 
              onClose={()=>{setShowModal(false)}}
             /> 
         </div>  
     ) 
}
export default function SlotManagement(){    
 const [slots,setSlots] = useState([]) 
 
 useEffect(()=>{ 
   if(!slots.length){
        API.getController('appointment').getUpcomingSlots(null) 
       .then((slots)=>{
         setSlots(slots); 
     }) 
   }

 },[slots.length]) 
 
 return(
     <Row className="mt-3 me-3 ms-4 mb-3">
        <Col id="slotDisplay" > 
          <Card className="rounded-0 " style={{height:'350px',maxHeight:'400px',overflowY:'auto',overflowX:'hidden'}}>
               <ActionBar/>
                <Table>
                 <thead>
                    <tr>
                      <th>Slot Date</th> 
                      <th>Start Time</th>
                      <th>End Time</th> 
                    </tr>
                 </thead> 
                 <tbody>
                      {slots.map((slot)=>{
                         return(
                            <tr>
                               <td>{slot.slotDate.split('T')[0]}</td> 
                               <td>{slot.startTime}</td> 
                               <td>{slot.endTime}</td>
                            </tr>
                         )
                      })}
                 </tbody>
                </Table>
          </Card>
        </Col> 
        <Col md={4}>  
           <Calendar/> 
        </Col>
     </Row>
 )
}