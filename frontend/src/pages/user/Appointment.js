import { useNavigate, useLocation } from 'react-router-dom'; 
import { useState, useEffect, useRef } from 'react'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { AddAppointments, setChangesRead, InitAllAppointments,RemoveAppointment, UpdateAppointment } from '../../reducers/appointmentReducer.js';
import { Card, Button, Form, InputGroup} from 'react-bootstrap';
import { IoMdArrowBack } from "react-icons/io" ; 
import InformationCard from '../../components/InformationCard.jsx';
import AppointmentController from '../../controllers/appointmentController.js';

import PopupForm from '../../components/PopupForm.jsx';
import AlertMessage from '../../components/AlertMessage.jsx';
// This component shows the list of appointments (confirmed, pending, history)  


function formatData(formattedData){ 
    return formattedData.map((data)=>{ 
         return{
            clinicId: data.clinicId,
            AppointmentId: data.AppointmentId,
            title : data.clinicName,
            imageSrc: data.imageSrc,
            text : data.address+"\n"+data.date.split('T')[0]+"\n"+data.startTime + " -" + data.endTime
         }
    })
} 

function AppointmentActionBar({clinicId, AppointmentId}){  
    
    const [showForm,setShowForm] = useState(false);  
    const [slots, setSlots] = useState([]);
    const startTime = useRef(''); 
    const endTime = useRef(''); 
    const SlotId = useRef('');
    const [displayedSlots, setDisplayedSlots] = useState([]);  
    const [showSlots,setShowSlots] = useState(false); 
    const [showAlert,setShowAlert] = useState(false);  
    const dispatch = useDispatch();
    const getUpcomingSlots = async()=>{ 
       if(slots.length === 0){
         AppointmentController.getUpcomingSlots(clinicId)
        .then((slots)=>{
           setSlots(slots); 
        }) 
       }
    }
    const onDateChangeHandler= (date)=>{
        console.log("Selected date:", date);
        console.log(slots);
        const filtered = slots.filter(slot => new Date(slot.slotDate).toISOString().split("T")[0] === date);
        console.log("Filtered slots:", filtered);
        setDisplayedSlots(filtered);
    }
    const handleCancellation= ()=>{ 
        console.log("Cancelling")
       AppointmentController.cancelAppointment(AppointmentId) 
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
       })
    } 

    const handlePostpone = ()=>{
       console.log(AppointmentId,SlotId.current,startTime.current,endTime.current);
       AppointmentController.postponeAppointment(AppointmentId,SlotId.current,startTime.current,endTime.current)
       .then((resp)=>{
        return resp.json(); 
       })
       .then((result)=>{
        if(result.status === "Success"){
             dispatch(
                UpdateAppointment(
                    {updatedAppoinment: result.updatedData}
                )
             )
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
        <div class="actionBar" style={{display:'flex'}}> 
            <Button variant="primary" onClick={async()=>{await getUpcomingSlots(); handleShowForm()}}>Postpone</Button> 
            <Button variant="danger"  onClick={handleShowAlert}>Cancel</Button>  
        </div>  

        <PopupForm title="Appoinment Postpone" show={showForm} setShowModal={setShowForm} submitHandler={handlePostpone}>
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
                        }
                    }}
                    >
                    {displayedSlots.map((slot, index) => (
                        <option key={index} value={slot.SlotId}>
                        {slot.startTime + ' - ' + slot.endTime}
                        </option>
                    ))}
                </Form.Select>
                </InputGroup>
               
            </Form.Group>
        </PopupForm> 
        
        <AlertMessage 
            body="Are you sure you want to cancel?" show={showAlert} positiveText="Yes" negativeText="No"  
            positiveHandler={handleCancellation} negativeHandler={()=>{}} setShow={setShowAlert}
        /> 
      </>
    )
}
function AppointmentList({ appointments }) {
    const [activeTab, setActiveTab] = useState('confirmed'); // 'confirmed', 'pending', or 'history' 
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
            <select 
                id="appointmentSelect"
                onChange={(event) => {
                    setActiveTab(event.target.value);
                }}
               
        >
                    <option value="confirmed">Upcoming Appointments</option>
                    <option value="pending">Pending Appointments</option>
                    <option value="history">Appointment History</option>
        </select>
          
            <p style={{
                fontWeight: 'bold', 
                fontSize: '20px', 
                color : activeTab === 'confirmed' ? 'green' 
                    : activeTab === 'pending' ? '#c2c248' 
                    : '#6c6c6c'
            }}>
                {activeTab === 'confirmed' ? 'Upcoming Confirmed Appointments' 
                    : activeTab === 'pending' ? 'Upcoming Pending Appointments' 
                    : activeTab === 'history'? 'Appointment History'
                    : null
                }
            </p> 
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
                   <Card.Title>
                       {appt.title}
                   </Card.Title>
                   <Card.Body>
                       {appt.text}
                   </Card.Body> 
                   
                  {
                    activeTab === 'pending' && 
                    <AppointmentActionBar clinicId={appt.clinicId} AppointmentId={appt.AppointmentId}/>
                  }
                   
                </InformationCard> 
                )
               })
            ): (
                <p>No {activeTab} appointments. </p>
            )
          }
            </div>
        </div>
    );
}


// Main Appointment page
export default function Appointment() {
    const navigate = useNavigate();
    const location = useLocation();   
    const dispatch = useDispatch();   
    
    const totalAppointments = useSelector(state => state.Appointment.totalAppointments); 
    const isModifiedInBackend = useSelector(state => state.Appointment.modifiedInBackend); 
    const totalPages = useSelector(state => state.Appointment.totalPages) 

    useEffect(()=>{
        AppointmentController.getUserAppointments(1)
        .then((appointments)=>{
            dispatch(InitAllAppointments(
                {
                    appointments: appointments
                }
            ))
        }) 
    
    },[dispatch])
 
    useEffect(()=>{     
       AppointmentController.getAppointmentCount(isModifiedInBackend).then((count)=>{
          if(totalAppointments < count){
            AppointmentController.getUserAppointments(totalPages + 1)
            .then((appointments)=>{
                dispatch(AddAppointments(
                    {
                        appointments: appointments
                    }
                ))
            })
          }
          else{
             dispatch(setChangesRead({
                isRead: true
             }))
          }
        }); 
       
    },[dispatch,totalAppointments,isModifiedInBackend,totalPages])


  
    const appointments = useSelector(state => state.Appointment.appointments);

    useEffect(() => {
        if (location.pathname === '/appointment') {
            document.body.style.backgroundImage = 'none';
            document.body.style.backgroundColor = '#b6a8f0';
            document.body.style.backgroundRepeat = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundPosition = '';
        }
    }, [location]);

    return ( 
        
        <div style={{ padding: '20px' }}>   
             <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
               <IoMdArrowBack onClick={()=>{
                  navigate('/home'); 
               }}/>
               <p>Back</p>
             </div>
             <div className="gridMenu" style={{ marginTop: '20px' }}> 
                <div 
                    className="optionBox" 
                    style={{
                        backgroundColor:'#6FAF98', 
                        padding: '20px', 
                        height: '95px', 
                        fontSize: '1rem',
                        borderRadius: '10px',
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate('/book')}
                >
                    <p className="buttonText" style={{ color: 'white', fontSize: '18px', fontWeight: 'bold'}}>
                        Click Here to Book an Appointment
                    </p>
                </div>
            </div> 
            {
                appointments ?  <AppointmentList appointments={appointments}/>  : 
                <p>Loading</p>
            }
            
        
        </div>
    );
}
