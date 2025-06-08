import { useEffect, useRef, useState } from 'react'; 
import AppointmentController from '../../controllers/appointmentController.js';  
import ClinicController from '../../controllers/clinicController.js'
import { IoMdArrowBack } from "react-icons/io" 
import {AiFillHome} from "react-icons/ai"
import {useNavigate} from 'react-router-dom';  
import { useDispatch } from 'react-redux'; 
import { AddAppointment,setChangesRead} from '../../reducers/appointmentReducer.js';
import React from 'react';

function AppointmentProcedure({ step, setStep }) {  
  const navigate = useNavigate(); 
  const dispatch = useDispatch(); 
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
  const [slots, setSlots] = useState(null);  

  useEffect(()=>{
      switch(step){
        case 1:  
          AppointmentController.getServices()
          .then((services)=>{
              setServices(services); 
          }) 
          .catch((err)=>{
            console.log(err); 
          })
          break; 

        case 2:  
         
         ClinicController.getClinicsByService(service_id.current)
         .then((clinics)=>{
           console.log(clinics);
           setClinics(clinics); 
         }) 
         .catch((err)=>{
          console.log(err); 
         })
         break;

        case 3: 
          AppointmentController.getUpcomingSlots(ClinicId.current)
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
    const response = await fetch('/api/appointment/addAppointment',
      { 
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "Authorization":"Bearer "+sessionStorage.getItem('token')
        },
        body: JSON.stringify(dataJson)
      }
    ) 
    const result = await response.json(); 
    return result; 
  }
  return (
    <div>
      {/* Stepper UI */}
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <StepLabel number={1} current={step} label="Choose Service" />
        <StepLabel number={2} current={step} label="Select Clinic" />
        <StepLabel number={3} current={step} label="Pick Date & Slot" />
        <StepLabel number={4} current={step} label="Finish" />
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
                         <button onClick={()=>{
                           ClinicId.current =  clinic.ClinicId;  
                           setStep(3)
                         }}>
                             {clinic.name}  
                         </button>
                     )
                 })
            }
        
          </div>
        )}
        {step === 3 && (
          <div style={{overflowY:'scroll',maxHeight:'24rem'
          }}>
            <h2>Select Slot</h2> 
    
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
