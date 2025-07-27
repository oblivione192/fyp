import InformationCard from "../../components/InformationCard"
import { useEffect,useState } from "react";  
import {useSelector} from 'react-redux';
import { Card } from "react-bootstrap";
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
    const [groupedMedicals,setGroupedMedicals] = useState(null); 
    const appointments = useAppointment(
      {
        role: 'user',
        mode: 'BySelf'
      }
    );
    
     useEffect(()=>{ 
            API.getController('medication').getPatientMedicals()
            .then((meds)=>{
               const groupedMedicals = groupMedicationsByAppointment(meds);  
               setGroupedMedicals(groupedMedicals); 
            })
            .catch((err)=>{
                 console.error(err.message); 
            })
     },[]) 
     if(groupedMedicals === null){
      return <p>Loading...</p>
     }
     return(
       <InformationCard>  
        
        { 
        
           Object.entries(groupedMedicals).map(([appointmentId,medication])=>{  
            const appointment = appointments.find((a) => a.AppointmentId ===  appointmentId);  
            return medication.map((medication)=>{
                return( 
                <Card>  
                  <Card.Title>{medication.diagnosis}</Card.Title>
                  <div className="horizontalSection">
                    <p>Medication: {medication.medication_name}</p>
                  </div>
                  <div className="horizontalSection">
                    <p>Prescription: {medication.prescription}</p>
                  </div>  
                  <div className="horizontalSection">
                    <p>Intake Frequency: {medication.frequency}</p>
                  </div> 
                  <div className="horizontalSection">
                    <p>Take For: {medication.duration_days}</p>
                  </div>
              </Card> 
            )
           })
            })
            
        }
         
       </InformationCard>
     )
}