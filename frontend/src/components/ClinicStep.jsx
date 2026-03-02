import API from "../controllers"; 
import { useState, useEffect } from "react"; 
import { Card } from "react-bootstrap"; 
import Loading from "./Loading";
export default function ClinicStep({ appointmentRef, onNext }) {
  const [clinics, setClinics] = useState(null);

  useEffect(() => {
    API.getController("clinic").getClinicsByService(
      appointmentRef.current.serviceId,
      { lat: appointmentRef.current.latitude, lng: appointmentRef.current.longitude }
    ).then(setClinics);
  }, []);

  if (!clinics) return <Loading />;

  return (
    <>
      <h2>Recommended Clinics</h2>
      {clinics.map(clinic => (
        <Card key={clinic.ClinicId}>
          <Card.Body>
            <Card.Title>{clinic.name}</Card.Title>
            <Card.Text>{clinic.address}</Card.Text>   
            <Card.Text>Drive Distance: {clinic.distance ? (clinic.distance / 1000).toFixed(2) + " km" : "N/A"}</Card.Text>
            <button
              onClick={() => {
                appointmentRef.current.ClinicId = clinic.ClinicId;
                appointmentRef.current.PatientId = localStorage.getItem("UserId");
                onNext();
              }}
            >
              Select
            </button>
          </Card.Body>
        </Card>
      ))}
    </>
  );
}
