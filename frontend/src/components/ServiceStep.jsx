import API from "../controllers"; 
import { useEffect, useState } from "react";
import Loading from "./Loading";
export default function ServiceStep({ appointmentRef, onNext }) {
  const [services, setServices] = useState(null);

  useEffect(() => {
    API.getController("Appointment").getServices().then(setServices);
  }, []);

  if (!services) return <Loading />;

  return (
    <>
      <h2>Choose a Service</h2>
      {services.map(service => (
        <button
          key={service.service_id}
          onClick={() => {
            appointmentRef.current.serviceId = service.service_id;
            appointmentRef.current.visitPurpose = service.service_name;
            onNext();
          }}
        >
          {service.service_name}
        </button>
      ))}
    </>
  );
}