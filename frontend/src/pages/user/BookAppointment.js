import { useEffect, useRef, useState} from 'react'; 
import { IoMdArrowBack } from "react-icons/io" 
import {AiFillHome} from "react-icons/ai"
import {useNavigate} from 'react-router-dom';  
import { useDispatch } from 'react-redux';    
import Card from 'react-bootstrap/Card';   
import { Row,Col,Container } from 'react-bootstrap';
import ListDisplayer from '../../components/ListDisplayer.jsx'; 
import {FormSelect} from 'react-bootstrap';
import API from '../../controllers/';
import { AddAppointment,setChangesRead} from '../../reducers/appointmentReducer.js'; 
import { useSelector } from 'react-redux';
import Event from '../../util/eventBus.js';
import React from 'react';


function AppointmentProcedure({ step, setStep }) {  
  const navigate = useNavigate(); 
  const dispatch = useDispatch();    

  const {latitude,longitude} = useSelector(state => state.Location) 
  const {address, wheelchairNeeded, preferredLanguage} = useSelector(state => state.Profile.profile) 
  
  const Latitude =  useRef(latitude); 
  const Longitude = useRef(longitude); 

  const SlotId =  useRef('');   
  const PatientId = useRef('');   
  const service_id = useRef('');  
  const ClinicId =  useRef(''); 
  const date = useRef('');  
  const visit_purpose = useRef('');    
  const startTime = useRef(''); 
  const endTime = useRef('');   
  
  const [services,setServices] =  useState(null); 
  const [clinics, setClinics] = useState(null); 
  const [rides, setRides] =  useState([]); 
  const [slots, setSlots] = useState(null);    

  const handleRecommend = ()=>{ 
      API.getController("Ride").recommendRides({
                    appointment_start_time: startTime.current || new Date().toISOString(), 
                    appointment_end_time: endTime.current || new Date(new Date().getTime() + 3600 * 1000).toISOString(),  
                    userCoordinates: {latitude:Latitude.current,longitude:Longitude.current},
                    destinationClinicId: ClinicId.current, 
                    requiresWheelchair: wheelchairNeeded, 
                    preferredLanguage: preferredLanguage
                },{

                })
                .then((rides)=>{ 
                    setRides(rides); 
                }) 
                .catch((err)=>{
                    Event.emit("OnFailure",err.message)
                }) 
   }
  useEffect(()=>{
      switch(step){
        case 1:  
          API.getController("Appointment").getServices()
          .then((services)=>{
              setServices(services); 
          }) 
          .catch((err)=>{
            console.log(err); 
          })
          break; 

        case 2:  
         
          API.getController("clinic").getClinicsByService(service_id.current,
            {
              lat: latitude  ? latitude : '3.0738', 
              lng: longitude ? longitude : '101.5183',
            }
          )
          .then((clinics)=>{
            console.log(clinics);
            setClinics(clinics); 
          }) 
          .catch((err)=>{
            console.log(err); 
          })
          break;

        case 3: 
          API.getController("Appointment").getUpcomingSlots(ClinicId.current)
          .then((slots)=>{ 
             const groupedSlots = slots.reduce((acc, slot) => {
                  const dateKey = new Date(slot.slotDate).toISOString().split('T')[0];
                  if (!acc[dateKey]) {
                    acc[dateKey] = [];
                  }
                  acc[dateKey].push(slot);
                  return acc;
              }, {});
            setSlots(groupedSlots); 
          })
          .catch((err)=>{
            console.log(err);
          }) 
          break; 

          
        case 4:
           break; 
        default:
           console.log("DONE");  
           setTimeout(()=>{
              navigate('/home')
           },1600);
           break;
      } 


  },[step,navigate])
  async function handleAppointmentSubmission(){ 
    const data = new FormData(); 
    data.append('date',date.current); 
    data.append('visit_purpose',visit_purpose.current); 
    data.append('startTime',startTime.current); 
    data.append('endTime',endTime.current);  
    data.append('SlotId', SlotId.current); 
    data.append('PatientId',PatientId.current); 
    
    const dataJson = Object.fromEntries(data.entries());  
    console.log(dataJson); 
    const result = await API.getController('appointment').addAppointment(dataJson); 
    return result; 
  }
  return (
    <div>
      {/* Stepper UI */}
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <StepLabel number={1} current={step} label="Choose Service" />
        <StepLabel number={2} current={step} label="Select Clinic" />
        <StepLabel number={3} current={step} label="Pick Date & Slot" />
        <StepLabel number={4} current={step} label="Book a Ride" /> 
        <StepLabel number={5} current={step} label="Finish"/>
      </div>

      {/* Step Content */}
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        {step === 1 && (
          <div>
            <h2>Choose a Service</h2>
            {
                services  === null  ?   
                    <><p>Loading</p></> 
                  : 
                  
                services.map((service)=>{ 
                  return(
                    <button onClick = {() => { 
                      service_id.current = service.service_id; 
                      visit_purpose.current = service.service_name; 
                      setStep(2)
                    }
                    } 
                      >
                        {service.service_name}
                        </button> 
                  ) 
                })
            }
          
          </div>
        )}
        {step === 2 && (
          <div>
            <h2>Recommended Clinics</h2>
            { 
               clinics == null ? 
                 <><p>Loading</p></> 
                 :
                clinics.map((clinic)=>{ 
                  return(
                     <ListDisplayer data={[clinic]}>
                        {(item)=>( 
                         <Card> 
                           <Row>
                                <Card.Body style={{overflowX:'hidden'}}> 
                                  <Card.Title>{item.name}</Card.Title>
                                  <Card.Text>
                                    {item.address}  
                                  </Card.Text> 
                                  <button onClick = {() => { 
                                    ClinicId.current = item.ClinicId;  
                                    PatientId.current = localStorage.getItem("UserId"); 
                                    setStep(3)
                                  } }> 
                                    Select
                                  </button>
                                </Card.Body>    
                              </Row> 
                           
                            </Card> 
                         
                       )}
                     </ListDisplayer> 
                  )
                })    
            }
        
          </div>
        )}
        {step === 3 && (
          <div style={{overflowY:'scroll',maxHeight:'24rem'
          }}>
            <h2>Select Slot</h2> 
            <button onClick={()=>{setStep(4)}}>Dummy button to click next</button>
            {    
     
                slots == null ? 
                <><p>Loading</p></> 
                :
                      
                  
                      Object.entries(slots).map(([dateKey, slotsForDate]) => (
                            <div key={dateKey}>
                              <h3>{dateKey}</h3>
                              {slotsForDate.map((slot) => (
                                <button
                                  key={slot.SlotId} 
                                  onClick={() => {
                                    SlotId.current = slot.SlotId;
                                    date.current = new Date(slot.slotDate).toISOString().split('T')[0];
                                    startTime.current = slot.startTime;
                                    endTime.current = slot.endTime; 
                                    document.getElementById('confirmButton').style.display='block';
                                  }}
                                >
                                  {slot.startTime + " - " + slot.endTime}
                                </button>
                              ))}
                            </div>
                          ))
            } 
            
           
          </div>
        )}
        {step === 4 && ( 
           <div>  

              <p><strong>Ride Booking</strong></p>   
               <Container>
  <Row className="align-items-center" style={{ marginBottom: '2rem' }}>
    {/* Label column */}
    <Col sm={4}>
      <p style={{ margin: 0 }}>Pickup From:</p>
    </Col>

    {/* Select column */}
    <Col sm={8}>
      <FormSelect
        onChange={async (e) => {
          if (e.target.value === "Home Address") {
            console.log("Getting home address coordinates");
            const coordinates = await API.getController("location")
              .getLocationCoordinates(address);

            Latitude.current = coordinates.lat;
            Longitude.current = coordinates.lng;
          } else if (e.target.value === "Test Coordinates") {
            Latitude.current = 4.332495;
            Longitude.current = 101.1478746;
          } else {
            Latitude.current = latitude;
            Longitude.current = longitude;
          }

          if (e.target.value !== "--") {
            handleRecommend();
          }
        }}
      >
        <option>--</option>
        <option>Test Coordinates</option>
        <option>Home Address</option>
        <option>Current Location</option>
      </FormSelect>
    </Col>
  </Row>

  {/* Rides list stays below */}
  <div style={{ maxHeight: '10rem', height: '10rem' }}>
    {rides.length === 0 ? (
      <div>No rides available</div>
    ) : (
      <ListDisplayer data={rides}>
        {(item) => (
          <Card>
            <Card.Body>
              <p>
                Session Start Time:{" "}
                {new Date(item.session_start_time).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <p>
                Session End Time:{" "}
                {new Date(item.session_end_time).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </Card.Body>
          </Card>
        )}
      </ListDisplayer>
    )}
  </div>
</Container>
              
          
              <button  
              style={{
                 marginTop:'4rem'
              }}
                onClick={()=>{setStep(5)}}
              > 
                Skip
              </button>
            </div>
        )} 
        {step === 5 && ( 
          <div>
            <h2>Booking Complete 🎉</h2>
            <p>Thank you for booking your appointment!</p>
          </div>
        )}
        <button id="confirmButton" style={{ display:'none',backgroundColor:'green',bottom:'40px',position:'relative'}} onClick={() => {
              handleAppointmentSubmission()
              .then((result)=>{
                if(result.status==="Success"){  
                   document.getElementById('confirmButton').style.display='none'; 
                   dispatch(
                    AddAppointment(
                       {
                        newAppointment: result.newAppointment
                       }
                    )
                   ) 
                   const appCount = localStorage.getItem("AppointmentCount"); 
                   localStorage.setItem("AppointmentCount",parseInt(appCount) + 1);  
                   setStep(4); 
                }
              })
            }
              
      }>Confirm</button>
      </div> 
      
    </div>
  );
}

// A small subcomponent for steps
function StepLabel({ number, current, label }) {
  const isActive = number === current;
  return (
    <div style={{ marginRight: '20px', textAlign: 'center' }}>
      <div
        style={{
          background: isActive ? '#4CAF50' : '#ccc',
          color: 'white',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          lineHeight: '30px',
          margin: '0 auto',
          marginBottom: '5px'
        }}
      >
        {number}
      </div>
      <div style={{ fontSize: '12px' }}>{label}</div>
    </div>
  );
}

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const navigate =  useNavigate(); 
  return (
    <div style={{ padding: '20px', gap: '10px' }}>   

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        width: '100%'
      }}>
        {/* Back icon and label group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IoMdArrowBack
            style={{ color: "white", width: "42px", height: "42px" }}
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else navigate('/appointment'); 
            }}
          /> 

            <span style={{ color: "white", fontSize: "18px" }}>Previous Step</span>
     
          
        </div>

        {/* Home icon */}
        <AiFillHome
          style={{ color: "white", width: "32px", height: "32px" }}
          onClick={() => {
            navigate('/home');
          }}
        /> 

      </div>
  <AppointmentProcedure step={step} setStep={setStep} />
</div>
  );
}
