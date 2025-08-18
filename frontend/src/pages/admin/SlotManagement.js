import {Row,Col,Card, Button, FormControl,FormLabel, FormGroup, FormSelect, Table} from 'react-bootstrap';
import { IoMdCalendar } from 'react-icons/io'; 
import Calendar from 'react-calendar'; 
import { useEffect, useState, useRef} from 'react'; 
import { CgTrash } from 'react-icons/cg';
import { FaPencilAlt } from 'react-icons/fa';
import API from '../../controllers';  
import PopupForm from '../../components/PopupForm';
import {useSelector, useDispatch} from 'react-redux'; 
import Event from '../../util/eventBus';
import { AddSlot,DeleteSlot, UpdateSlot, initSlots } from '../../reducers/slotsReducer';
function SlotAddingForm({showModal,onClose}){   
     const dispatch =  useDispatch(); 
     const slotDate =  useRef(); 
     const startTime = useRef();
     const endTime = useRef(); 
     const addSlot = function(){ 
          API.getController('appointment').addClinicSlot({  
            slotDate: slotDate.current,
            startTime: startTime.current,
            endTime: endTime.current,
          }) 
          .then((response)=>{
                 console.log(response);  

                 dispatch(AddSlot( 
                   {
                     SlotId: response.addedSlot.slotId, 
                     slotDate: slotDate.current,
                     startTime: startTime.current,
                     endTime: endTime.current
                   }
                 ))
                 Event.emit('OnSuccess',
                  {
                     title:"Success",
                     message:"Slot Successfully Added"
                  }
                 )
             
          })
          .catch((err)=>{
              Event.emit('OnFailure',
               {
                   title:"Failure", 
                   message:err.message
               }
              )
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
         <div className="actionBar" style={{position:'static'}}>
             <Button variant="success" onClick={()=>{setShowModal(true)}}>Add Slot</Button>  
             <SlotAddingForm showModal={showModal} 
              onClose={()=>{setShowModal(false)}}
             /> 
         </div>  
     ) 
} 
export default function SlotManagement(){     
 const dispatch = useDispatch(); 
 const slots = useSelector(state => state.Slot.slots);  
 const hasSlotInit = useSelector(state => state.Slot.hasInit);  

 const handleDelete = function(slotId){
    API.getController('appointment') 
       .deleteClinicSlot(slotId)
       .then((result)=>{
          if(result.status === "success"){
             dispatch(DeleteSlot({SlotId: slotId})); 
             Event.emit('OnSuccess',{
               title: "Success" ,
               message: "Slot successfully deleted"
             })
          }
          else{
              Event.emit('OnFailure',{
                 title: "Failure",
                 message:result.message
              })
          }
       })
 }
 useEffect(()=>{ 
   if(!hasSlotInit){
        API.getController('appointment').getUpcomingSlots(null) 
       .then((slots)=>{
          dispatch(initSlots(slots));  
       })  
   }

 },[hasSlotInit,dispatch]) 
 
 return(
     <Row className="mt-3 me-3 ms-4 mb-3">
        <Col id="slotDisplay" > 
          <Card className="rounded-0 " style={{height:'370px',overflowX:'hidden',overflowY:'hidden'}}>
               
               <ActionBar/> 
                <p>Upcoming Slots</p>
              
                  <Table>
                  <thead>
                     <tr>
                        <th>Slot Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td colSpan="4" style={{ padding: 0 }}>
                        <div style={{
                           maxHeight: '220px',
                           overflowY: 'auto',
                           display: 'block'
                        }}>
                           <table className="table mb-0">
                              <tbody>
                              {slots.map((slot, index) => (
                                 <tr key={index}>
                                    <td>{slot.slotDate.split('T')[0]}</td>
                                    <td>{slot.startTime.slice(0, 5)}</td>
                                    <td>{slot.endTime.slice(0, 5)}</td>
                                    <td>
                                    <div style={{ display: 'flex' }}>
                                       <CgTrash onClick={()=>{
                                          Event.emit('OnWarning',{
                                             title:"Are you sure you want to delete the slot",
                                             message:"All appointments associated with the slots will be deleted.",
                                             negativeHandler: function(){},
                                             positiveHandler: function(){handleDelete(slot.SlotId)}
                                          })
                                       }
                                       }style={{ cursor: "pointer" }} />
                                       <FaPencilAlt style={{ marginLeft: '20px', cursor: "pointer" }} />
                                    </div>
                                    </td>
                                 </tr>
                              ))}
                              </tbody>
                           </table>
                        </div>
                        </td>
                     </tr>
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