import { Card } from "react-bootstrap"
export default function MedicationInfo({appointment,medInfo}){ 
  return(
    <Card>
        <Card.Title>{medInfo.diagnosis}</Card.Title> 
        <Card.Title>Prescribed by: {appointment.doctorName}</Card.Title> 
        <Card.Title>Diagnosed at: {appointment.clinicName}</Card.Title> 
        <Card.Body>
             <Card.Text> 
                <div class="horizontalSection">
                  <p>Medication: {medInfo.medication_name}</p>
                </div>
                <div class="horizontalSection">
                   <p>Prescription: {medInfo.prescription}</p>
                </div>  
                <div class="horizontalSection">
                   <p>Intake Frequency: {medInfo.frequency}</p>
                </div> 
                <div class="horizontalSection">
                  <p>Take For: {medInfo.duration_days}</p>
                </div>
             </Card.Text> 
        </Card.Body>
    </Card> 
  )
}