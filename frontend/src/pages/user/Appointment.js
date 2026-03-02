import { useNavigate, useLocation } from 'react-router-dom'; 
import { useState, useEffect, useRef } from 'react'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { AddAppointments, setChangesRead, InitAllAppointments,RemoveAppointment, UpdateAppointment } from '../../reducers/appointmentReducer.js';
import RideStep from '../../components/RideStep.jsx';    
import { AppointmentProcedure } from './BookAppointment.js';
import { Modal } from 'react-bootstrap';
import { Card, Button, Form, InputGroup, Col} from 'react-bootstrap';
import { IoMdArrowBack } from "react-icons/io" ;   
import { FaArrowRight } from 'react-icons/fa';
import Event from '../../util/eventBus.js';
import InformationCard from '../../components/InformationCard.jsx';  
import API from '../../controllers/index.js';
import PopupForm from '../../components/PopupForm.jsx'; 
import useAppointment from '../../hooks/useAppointment.js';
import AlertMessage from '../../components/AlertMessage.jsx'; 
import { showFormattedTime,showFormattedDate } from '../../util/Time.js';  
import {FormSelect} from 'react-bootstrap'
// This component shows the list of appointments (confirmed, pending, history)  


function formatData(formattedData){ 
    return formattedData.map((data)=>{   
         console.log(data.date); 
         const formattedDate = showFormattedDate(data.date); 
         const formattedStartTime = showFormattedTime(new Date(`${data.date}T${data.startTime}`).getTime()); 
         const formattedEndTime = showFormattedTime(new Date(`${data.date}T${data.endTime}`).getTime()); 
         return{
            clinicId: data.clinicId,
            visit_purpose: data.visit_purpose,
            AppointmentId: data.AppointmentId,   
            doctorName: data.doctorName,
            title : data.clinicName,
            imageSrc: data.imageSrc, 
            address: data.address,
            date: formattedDate, 
            startTime: formattedStartTime, 
            endTime: formattedEndTime, 
         }
    })
} 

function RideBookingComponent({appointment_details,show,setShow}){   
     const handleClose= ()=>{setShow(false)};   
     const {latitude,longitude} = useSelector(state => state.Location)
     const {address,wheelchairNeeded,preferredLanguage} =useSelector(state => state.Profile.profile)
     return(  
      <Modal show={show} onHide={handleClose}> 
         <Modal.Body>
            <RideStep 
                appointmentStartTime = {appointment_details.startTime} 
                appointmentEndTime = {appointment_details.endTime} 
                appointmentDate = {appointment_details.date}  
                clinicId= {appointment_details.clinicId}
                wheelchairNeeded = {wheelchairNeeded}  
                preferredLanguage = {preferredLanguage}
                address ={address} 
                latitude = {latitude} 
                longitude = {longitude} 
                onSkip={()=>{handleClose()}}
                onCompleteRide={()=>handleClose()}
          /> 
         </Modal.Body>
          
      </Modal>
     
     )
}
function AppointmentActionBar({clinicId, AppointmentId}){  
    
    const [showForm,setShowForm] = useState(false);   
    
    const [slots, setSlots] = useState([]);
    const startTime = useRef(''); 
    const endTime = useRef(''); 
    const SlotId = useRef('');
    const SelectedSlot = useRef(''); 
    const [displayedSlots, setDisplayedSlots] = useState([]);  
    const [showSlots,setShowSlots] = useState(false); 
    const [showAlert,setShowAlert] = useState(false);  
    const [newAppointmentDetails,setNewAppointmentDetails] = useState(null); 
    const [showRideModal, setShowRideModal]= useState(false); 

    const dispatch = useDispatch();
    const getUpcomingSlots = async()=>{ 
       if(slots.length === 0){
         API.getController('appointment').getUpcomingSlots(clinicId)
        .then((slots)=>{
           setSlots(slots); 
        }) 
       }
    }
    const onDateChangeHandler= (date)=>{
        console.log("Selected date:", date);
        
        const filtered = slots.filter(slot => new Date(slot.slotDate).toISOString().split("T")[0] === date);
        console.log("Filtered slots:", filtered);
        setDisplayedSlots(filtered);
    }
    const handleCancellation= ()=>{ 
        console.log("Cancelling")
       API.getController('appointment').cancelAppointment(AppointmentId) 
       .then((result)=>{
         if(result.status==='Success'){
             dispatch(
                RemoveAppointment(
                   {
                    deletedAppointmentId : result.deletedId
                   }
                )
             )  
             
         }
         else{
            console.log("Failure to postpone")
             Event.emit("OnFailure",{
                 title:"Failure",
                 message: result.message
             })
         }
       })
    } 

    const handlePostpone = ()=>{
       console.log(AppointmentId,SlotId.current,startTime.current,endTime.current);
     
       API.getController('appointment').postponeAppointment(AppointmentId,SlotId.current,startTime.current,endTime.current)
       .then((result)=>{
        if(result.status === "Success"){
             const newStartTime = result.updatedData.newStartTime; 
             const newEndTime = result.updatedData.newEndTime; 
            
             dispatch(
                UpdateAppointment(
                    {updatedAppointment: { 
                         AppointmentId: AppointmentId,  
                         date :  SelectedSlot.current.slotDate, 
                         startTime:  newStartTime,
                         endTime: newEndTime
                    }}
                )
             ) 
             setNewAppointmentDetails({
                date: SelectedSlot.current.slotDate, 
                clinicId: clinicId,
                startTime: newStartTime,
                endTime: newEndTime 
             }) 

             setShowRideModal(true); 
        }
        else{  
            var message = ''; 
            if(result.message.includes('clash')){
                message = `Sorry! You have another appointment on ${showFormattedDate(SelectedSlot.current.slotDate)} at 
                 ${showFormattedTime(new Date(SelectedSlot.current.slotDate+"T"+startTime.current).getTime())}. Please choose another slot.`
            }
            else{
                message = result.message; 
            }
            Event.emit("OnFailure",{
                 title:"Its okay do not panic. We got you.",
                 message: message
             })
        }
       })
       .catch((err)=>{
         console.log(err); 
       })

     
    }
     const handleShowForm = ()=>{
        setShowForm(true);
     }
     const handleShowAlert =()=>{
        setShowAlert(true); 
     }
    return( 
      <>
        <div className="actionBar" style={{display:'flex',justifyContent:'space-between'
        }}> 
            <Button 
            variant="primary"  
            onClick={async()=>{await getUpcomingSlots(); handleShowForm()}}
            >Postpone
            </Button> 


            <Button 
            variant="danger"  
            onClick={handleShowAlert}
            >
                Cancel
            </Button>  
        </div>  

        <PopupForm title="Appointment Postpone" showModal={showForm} onClose={()=>{setShowForm(false)}} submitHandler={handlePostpone}>
            <Form.Group>
                <Form.Label>Select Postpone Slots</Form.Label> 
                <InputGroup>   
                    <Form.Control 
                        type="date"  
                        onChange={(event)=>{ 
                            setShowSlots(true);
                            onDateChangeHandler(event.target.value); 
                        }}
                    /> 
                <Form.Select
                    name="SlotId" 
                    aria-placeholder='Click here to select the date'
                    style={{ display: showSlots ? 'block' : 'none' }}
                    onChange={(event) => {
                        const selectedSlotId = event.target.value;   
                        const selectedSlot = displayedSlots.find(
                           (slot) => slot.SlotId.toString() === selectedSlotId
                        ); 

                        if (selectedSlot) {
                            startTime.current = selectedSlot.startTime;
                            endTime.current = selectedSlot.endTime;
                            SlotId.current = selectedSlot.SlotId;  
                            SelectedSlot.current = selectedSlot; 
                        }
                    }}
                    >
                    <option selected disabled>Click here To select a Date</option>
                    {displayedSlots.map((slot, index) => (
                        <option key={index} value={slot.SlotId}>
                        {showFormattedTime(new Date(`${slot.slotDate}T${slot.startTime}`).getTime()) 
                        + ' - ' 
                        + showFormattedTime(new Date(`${slot.slotDate}T${slot.endTime}`).getTime())}
                        </option>
                    ))}
                </Form.Select>
                </InputGroup>
               
            </Form.Group>
        </PopupForm> 
       {
         newAppointmentDetails && 
         <RideBookingComponent 
           appointment_details={newAppointmentDetails} 
           show={showRideModal} 
           setShow={setShowRideModal}
         /> 
       }
        <AlertMessage 
            body="Are you sure you want to cancel?" show={showAlert} positiveText="Yes" negativeText="No"  
            positiveHandler={handleCancellation} negativeHandler={()=>{}} setShow={setShowAlert}
        /> 
      </>
    )
}
function AppointmentList({ appointments }) {
    const [activeTab, setActiveTab] = useState('confirmed'); // 'confirmed', 'pending', or 'history'  
    const navigate = useNavigate(); 
    // Filter the appointments by status
    const confirmedAppointments = formatData(appointments.filter(appt => Date.now() < new Date(appt.date+"T"+appt.startTime) && appt.confirmed && !appt.attended ));
    const pendingAppointments = formatData(appointments.filter(appt => Date.now() < new Date(appt.date) && !appt.confirmed));
    const pastAppointments = formatData(appointments.filter(appt => Date.now() > new Date(appt.date) && appt.attended));// Filter past appointments

    const displayedAppointments = activeTab === 'confirmed' ? confirmedAppointments 
                            : activeTab === 'pending' ? pendingAppointments 
                            : activeTab === 'history' ? pastAppointments
                            : null
                            ; // Adjust display based on active tab
    
    return (
        <div id="appointmentList"> 
            <FormSelect 
                id="appointmentSelect" 
                style={{
                    borderStyle:'none',
                    backgroundColor:'#dedbe3ff',
                    color:'#3d403e'
                }}
                onChange={(event) => {
                    setActiveTab(event.target.value);
                }}
               
            >
                    <option value="confirmed">Confirmed Appointments</option>
                    <option value="pending">Not Confirmed Appointments</option>
                    <option value="history">Appointment History</option>
           </FormSelect>
          
            
            <div id="displayedAppointments"> 
            {
            displayedAppointments.length > 0 ? (
               displayedAppointments.map((appt)=>{ 
                return(
                <InformationCard>  
                    { 
                        appt.imageSrc && 
                        <Card.Img 
                            src={appt.imageSrc} 
                        />  
                    }
                   <Card.Title 
                    style={{
                        marginTop:'0px',
                        marginBottom:'0px',
                    }}
                   >
                       <p>{appt.title}</p>  
                       <strong style={{fontSize:'16px'}}>{appt.date}</strong>
                   </Card.Title> 
                   
                   <Card.Footer
                     style={{
                        marginBottom:'9px'
                     }}
                   >
                        <footer style={{fontSize:'15px'}}>
                             <p>Slot: {appt.startTime}  to  {appt.endTime}</p> 
                             <p>Address: {appt.address}</p> 
                             <p>Doctor in Charge: {appt.doctorName}</p>
                             <p><strong>{appt.visit_purpose} Session</strong></p>
                        </footer>
                   </Card.Footer>
                   {
                    activeTab === 'pending' && 
                    <AppointmentActionBar clinicId={appt.clinicId} AppointmentId={appt.AppointmentId}/>
                  }      
                    <Col xs="auto">
                     <div  
                        onClick={()=>{navigate(`/appointment/${appt.AppointmentId}`)}}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#2F6F4F",
                            cursor: "pointer",
                        }}
                        >
                        View Details
                        <FaArrowRight size={12} />
                        </div>
                   </Col>
                   
                </InformationCard> 
                )
               })
            ): (
                <p>No {activeTab} appointments. </p>
            )
          } 
         
         </div> 
            <Button 
            id="bookAppointmentBt"
            variant="success" 
            onClick={()=>{navigate('/book')}}
            >Click here to book an Appointment</Button>
        </div>
    );
}


// Main Appointment page
export default function Appointment() {
    const navigate = useNavigate(); 
    const {isAppointmentFetched,appointments}= useAppointment({ 
        option:'ByUser'
    }) 

    return ( 
        
        <div style={{ padding: '5px' }}>   
             <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
               <Button onClick={()=>{
                 navigate('/home')
               }
               }>Back to Home</Button>
             </div>
             <div className="gridMenu" style={{ marginTop: '20px' }}> 
                
            </div> 
            {
                isAppointmentFetched ?  <AppointmentList appointments={appointments}/>  : 
                <p>Loading</p>
            }
            
        
        </div>
    );
}
