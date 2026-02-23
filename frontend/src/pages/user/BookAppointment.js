import React, { useRef, useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ServiceStep from '../../components/ServiceStep.jsx'; 
import ClinicStep from '../../components/ClinicStep.jsx'; 
import SlotStep from '../../components/SlotStep.jsx'; 
import RideStep from '../../components/RideStep.jsx'; 
import FinishStep from '../../components/FinishStep.jsx';

import API from '../../controllers/';
import { AddAppointment } from '../../reducers/appointmentReducer.js';
import Event from '../../util/eventBus.js';

// -------------------- Utility Components --------------------


function StepContainer({ children }) {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      {children}
    </div>
  );
}

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






// -------------------- Main Appointment Procedure --------------------
function AppointmentProcedure({ step, setStep }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { latitude, longitude } = useSelector(state => state.Location);
  const { address, wheelchairNeeded, preferredLanguage } = useSelector(state => state.Profile.profile);

  const appointmentRef = useRef({
    SlotId: "",
    PatientId: "",
    serviceId: "",
    ClinicId: "",
    date: "",
    visitPurpose: "",
    startTime: "",
    endTime: "",
    latitude,
    longitude,
  });

  const [showConfirm, setShowConfirm] = useState(false);

  const handleAppointmentSubmission = async () => {
    const payload = {
      date: appointmentRef.current.date,
      visit_purpose: appointmentRef.current.visitPurpose,
      startTime: appointmentRef.current.startTime,
      endTime: appointmentRef.current.endTime,
      SlotId: appointmentRef.current.SlotId,
      PatientId: appointmentRef.current.PatientId,
    };

    try {
      const result = await API.getController("appointment").addAppointment(payload);
      if (result.status === "Success") { 
        dispatch(AddAppointment({ newAppointment: result.newAppointment }));
        localStorage.setItem(
          "AppointmentCount",
          parseInt(localStorage.getItem("AppointmentCount") || 0) + 1
        );
        setStep(4);
      }
    } catch (err) {
      Event.emit('OnFailure', 
                        { 
                          title:"Failure", 
                          message:err.message 
                        }
                  )
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div>
      {/* Stepper UI */}
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <StepLabel number={1} current={step} label="Choose Service" />
        <StepLabel number={2} current={step} label="Select Clinic" />
        <StepLabel number={3} current={step} label="Pick Date & Slot" />
        <StepLabel number={4} current={step} label="Book a Ride" />
        <StepLabel number={5} current={step} label="Finish" />
      </div>

      <StepContainer>
        {step === 1 && (
          <ServiceStep appointmentRef={appointmentRef} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <ClinicStep appointmentRef={appointmentRef} onNext={() => setStep(3)} />
        )}
        {step === 3 && (
          <> 
            <SlotStep
            appointmentRef={appointmentRef}
            onSelectSlot={() => setShowConfirm(true)}
           />
          </>
        
        )}
        {step === 4 && (
          <RideStep
            appointmentDate = {appointmentRef.current.date}
            appointmentStartTime = {appointmentRef.current.startTime} 
            appointmentEndTime = {appointmentRef.current.endTime} 
            wheelchairNeeded={wheelchairNeeded}
            preferredLanguage={preferredLanguage} 
            clinicId = {appointmentRef.current.ClinicId}
            address={address}
            latitude={latitude}
            longitude={longitude}
            onSkip={() => setStep(5)}
            onCompleteRide={() => setStep(5)}
          />
        )}
        {step === 5 && <FinishStep navigate={navigate} />}
      </StepContainer>

      {showConfirm && (
        <button
          style={{ backgroundColor: "green", marginTop: "20px" }}
          onClick={()=>{handleAppointmentSubmission() 
  
            .finally(()=>{
                setShowConfirm(false); 
            })
          }}
        >
          Confirm
        </button>
      )}
    </div>
  );
}


// -------------------- Main Wrapper --------------------
export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', gap: '10px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IoMdArrowBack
            style={{ color: "white", width: "42px", height: "42px" }}
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/appointment')}
          />
          <span style={{ color: "white", fontSize: "18px" }}>Previous Step</span>
        </div>
        <AiFillHome
          style={{ color: "white", width: "32px", height: "32px" }}
          onClick={() => navigate('/home')}
        />
      </div>
      <AppointmentProcedure step={step} setStep={setStep} />
    </div>
  );
}
export {BookAppointment,AppointmentProcedure}
