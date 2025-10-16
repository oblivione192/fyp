import InformationCard from "../../components/InformationCard"
import { useEffect,useState } from "react";  
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../../controllers";  
import useAppointment from "../../hooks/useAppointment";

function groupMedicationsByAppointment(medications) {
  return medications.reduce((acc, med) => {
    const { AppointmentId } = med; 
    const appointment_id = AppointmentId; 
    if (!acc[appointment_id]) {
      acc[appointment_id] = [];
    }
    acc[appointment_id].push(med);
    return acc;
  }, {});
} 

export default function MedicationPage(){  
  const navigate = useNavigate(); 
  const [groupedMedicals, setGroupedMedicals] = useState(null); 
  const { isAppointmentFetched, appointments } = useAppointment({ option: 'ByUser' });

  useEffect(()=>{ 
    API.getController('medication').getPatientMedicals()
      .then((meds)=>{
        const grouped = groupMedicationsByAppointment(meds);  
        setGroupedMedicals(grouped); 
      })
      .catch((err)=> console.error(err.message));
  },[])  

  if (!groupedMedicals || !isAppointmentFetched) {
    return <p>Loading...</p>;
  }

  return(
    <>
      <button onClick={()=>{navigate('/home')}}>Back to Home</button>
      <InformationCard> 
        <div style={{overflowY:'auto', maxHeight:'40rem', height:'40rem'}}>
          {Object.entries(groupedMedicals).map(([appointmentId, meds]) => {  
            const appointment = appointments.find(
              (a) => String(a.AppointmentId) === String(appointmentId)
            );

            return meds.map((med) => (
              <Card key={med.MedicationId || `${appointmentId}-${med.medication_name}`}>
                <Card.Title>{med.diagnosis}</Card.Title>
                <div className="horizontalSection"><p>Medication: {med.medication_name}</p></div>
                <div className="horizontalSection"><p>Prescription: {med.prescription}</p></div>
                <div className="horizontalSection"><p>Intake Frequency: {med.frequency}</p></div>
                <div className="horizontalSection"><p>Take For: {med.duration_days}</p></div>
              </Card>
            ));
          })}
        </div>
      </InformationCard> 
    </>
  );
}
