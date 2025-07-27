import useAppointment from "../../hooks/useAppointment"; 
import { Card } from "react-bootstrap"; 
import {Row,Col, Container,Button, InputGroup,FormControl, FormSelect, FormLabel, Table} from "react-bootstrap"; 
import Calendar from "react-calendar";   
import { formatDate } from "../../util/Time"; 
import { useState , useEffect, useMemo} from "react";
import 'react-calendar/dist/Calendar.css';  
import {ListGroup, ListGroupItem} from 'react-bootstrap'
import SearchBar from "../../components/SearchBar"; 
import PopupForm from "../../components/PopupForm";  
import API from "../../controllers";  
import { useRef } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import {initEnrollment} from "../../reducers/enrollmentReducer";
function ConfirmForm({ appointmentId, show, onClose }) {  
  const dispatch= useDispatch();   
  
  const enrollmentHasInit = useSelector(state=> state.Enrollment.isInit)
  const enrollments=  useSelector(state=>state.Enrollment.enrollments)
  
  const doctorId = useRef(''); 
  const handleConfirm = function(){
    API.getController('appointment')
    .confirmAppointment({AppointmentId: appointmentId,DoctorId: doctorId.current})
    .catch((err)=>{
      console.log(err.mesage)
    })
  }
  useEffect(()=>{  
    if(!enrollmentHasInit){
         API.getController('clinic').getClinicEnrollments(null).then((enrollments)=>{
         dispatch(initEnrollment(enrollments));
      })
    }
    
  },[enrollmentHasInit,dispatch])
  return (
    <PopupForm 
      title="Confirm Appointment" 
      showModal={show} 
      onClose={onClose} 
      submitHandler={() => {
         handleConfirm()
      }}
    >
     <Card>
         <SearchBar placeholder="Search Doctor"/>  
         <ListGroup className="mt-3"> 
              {
                enrollments.length > 0  ? 
                enrollments.map((enrollment,index)=>{
                  return <ListGroupItem key={index} onClick={()=>{doctorId.current = enrollment.DoctorId}} className="d-flex gap-3 rounded-pill" style={{justifyContent:"space-between"}}>
                    <div onClick={()=>{doctorId.current=enrollment.DoctorId}}>{enrollment.doctorName}</div> 
                  </ListGroupItem>
                }) : 
                enrollmentHasInit ?  <p>Loading</p> : 
                <></>
              }  
         </ListGroup>  

         {/* <Table style={{overflowY:"auto",maxHeight:"80vh"}}>  
             {
              enrollments.length > 0 ?
              enrollments.map((enrollment)=>{
                return( 
                    <tr>
                       <td>{enrollment.doctorName}</td>
                    </tr>
                )
              })   : 
              <tr>Loading</tr> 
             }
         </Table> */}
       </Card>
    </PopupForm>
  );
}

function NoAppointment(){
    return(
       <Card className="rounded-0" style={{height:'100vh'}}>
             <Card.Title>No Appointments Today</Card.Title> 
             <Card.Body>
               You may schedule more appointments. 
             </Card.Body>
       </Card>
    )
} 

function Actions({ appointmentId, children }) {
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  
  return (
    <>
      <FormSelect onChange={(e) => {
        if (e.target.value === 'confirm') {
          setShowConfirmForm(true);
        }
      }}>
        {children}
      </FormSelect>

      <ConfirmForm appointmentId={appointmentId} show={showConfirmForm} onClose={() => setShowConfirmForm(false)} />
    </>
  ); 
} 

export default function PatientAppointments(){  
  const [filter, setFilter] = useState({});  
  const [searchCriteria, setSearchCriteria] = useState([]);    
  const appointments = useAppointment(
        {
            option: 'ByClinic',
        }
    )    
  
  const defaultFilteredAppointments = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return appointments.filter(appointment => {
      const appointmentDateStr = new Date(appointment.date).toISOString().split('T')[0];
      return appointmentDateStr === todayStr;
    });
}, [appointments]); 


  const [filteredAppointments,setFilteredAppointments] = useState(defaultFilteredAppointments) 
  useEffect(() => { 
  if(Object.entries(filter).length &&
     Object.entries(filter).some(([key,value])=>{
         return value !== ''; 
     })
   ){
    const filtered = appointments.filter(appointment => { 

      return Object.entries(filter).every(([key, value]) => {
        if (!value || value === '') return true;  
        
        if(key === 'approved'){
           return appointment.confirmed && appointment.date > new Date();  
        } 
        if(key === 'pending'){
           return !appointment.confirmed && appointment.date >  new Date(); 
        } 

        const appointmentValue = appointment[key];
        
      

        if (key === 'date') {
          const appointmentDate = new Date(appointmentValue).toISOString().split('T')[0];
          return appointmentDate === value;
        }


        if (typeof appointmentValue === 'string') {
          return appointmentValue.toLowerCase().includes(value.toLowerCase());
        }

        return appointmentValue === value;
      }); 
  
    });

  setFilteredAppointments(filtered); 
}
else{
   setFilteredAppointments(defaultFilteredAppointments)
}
}, [filter, appointments, defaultFilteredAppointments]);
   
 return(  
    <div> 
       <Row> 
         <Col sm={12} md={9} style={
          {backgroundColor:'#e4ebe5'}}>  
           <div className="actionBar" style={{backgroundColor:'white'}}>
                 <InputGroup>  
                  <SearchBar placeholder="Search appointment" changeHandler={(query)=>{
                      setFilter({
                        [searchCriteria] : query
                      }) 
                   }}/>   
                   <FormSelect onChange={(e)=>{setSearchCriteria(e.target.value);}}>
                     <option value="">Search Criteria</option> 
                     <option value="patient_name">Patient</option> 
                     <option value="doctorName">Doctor</option> 
                     <option value="approved">Approved Appointments</option> 
                     <option value="pending">Pending Appointments</option> 
                   </FormSelect>
                   <Button  xs={4} style={{height:'100%'}} variant="success" className="rounded-0">
                     Schedule View
                   </Button>
                 </InputGroup>
            </div>
            
         <div style={{overflowY:'auto',maxHeight:'100vh'}}>  
          {filteredAppointments.length > 0 && 
 
            <Table>
                  <thead>
                        <tr>
                           <th>Name</th> 
                           <th>Date</th>
                           <th>Slot</th>  
                           <th>Doctor</th> 
                           <th>Action</th>
                        </tr>
               </thead>  
               <tbody>
                {
                     filteredAppointments 
                     .map((appointment,index)=>{   
                      
                     return( 
                       <tr key={index}>
                         <td>{appointment.patient_name}</td> 
                         <td>{formatDate(appointment.date.split('T')[0])}</td> 
                         <td>{appointment.startTime.substring(0,5) + " - "+appointment.endTime.substring(0,5)}</td>
                         <td>{appointment.doctorName}</td> 
                         <td>
                           <Actions appointmentId={appointment.AppointmentId} key={index}>
                                <option value="postpone">Postpone</option>  
                             {
                            appointment.confirmed !== true && new Date(appointment.date) > new Date() 
                              ? <option value="confirm">Confirm</option>
                              : null
                          }
                          {
                            appointment.confirmed === true 
                              ? <option value="attended">Attended</option>
                              : null
                          }
                           </Actions>
                        </td> 
                       </tr>  
                  ) 
                  })
                 }
          
               </tbody>
            </Table> 


           }  
           
           {!filteredAppointments.length && <NoAppointment/>}
            
           
          
         </div>
        
        </Col> 
        <Col sm={12} md={3}>   
          <Card style={{height:'100vh'}}>  
           <Row>
            <Card.Title className="d-flex justify-content-between align-items-center w-100">
              <p className="mb-0">Filter by Date</p>
              <input className="ml-3" type="checkbox" onChange={(e)=>{
                 if(e.target.checked){
                   setFilter({...filter,date:''}); 
                 }
              }}/>
            </Card.Title>
          </Row>
          
             <Calendar   
               tileClassName="calendarTile"
               defaultValue={new Date()}  
               onChange={(value)=>{
                //setSelectedDate(new Date(value).toISOString().split('T')[0])  
                setFilter({...filter,date:new Date(value).toISOString().split('T')[0]}) 
               }}
             />
          </Card>
        </Col> 
  
      </Row>
    </div>
 
 )
} 