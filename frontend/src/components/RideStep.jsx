import { useState } from "react"; 
import API from "../controllers";  
import {Container,Col, Row, FormSelect, Card} from 'react-bootstrap';
import calculateRidePrice from "../util/calculateRidePrice"; 
import { Modal } from "react-bootstrap"
import ListDisplayer from "./ListDisplayer";   
import { showFormattedDate, showFormattedTime } from "../util/Time"; 
import Event from "../util/eventBus";
async function handleRideBooking({ staff_id, staff_vehicle_id, ride_timestamp, ride_end, destination_clinic_id }) {
  try {

    const result = await API.getController("Ride").bookRide({
      staff_id,
      staff_vehicle_id,
      ride_timestamp,
      ride_end,
      destination_clinic_id
    }); 


    if (result.status) {
      console.log("Booked success!");
      Event.emit('OnSuccess',{
         title:'Ride Successfully Booked!',
         message:'Hooray! Your ride is scheduled.'
      })
    }
  } catch (err) {
    console.error(err);
  }
} 
 function RideListModal({ title, show, handleClose, children }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
} 

function RideCard({ ride, onBook }) {
  const durationMins = Math.floor((ride.session_end_time - ride.session_start_time) / 60000);
  const waitingHrs = Math.floor(Math.abs(ride.time_margin) / 60);
  const waitingMins = Math.floor(Math.abs(ride.time_margin)) % 60;
  return (  
     
    <Card>  
      <span className="chip.success" style={{ position: 'absolute', top: '10px', right: '10px' }}>
         Recommended
      </span>  

      <Card.Body>
        <strong>
          {new Date(ride.session_start_time).toLocaleString(undefined, { timeStyle: 'short' })}
          {" - "}
          {new Date(ride.session_end_time).toLocaleString(undefined, { timeStyle: 'short' })}
        </strong>
        <p>Duration: {durationMins} minutes</p>
        <p>Price: RM {calculateRidePrice(
          ride.distance_staff_patient,
          ride.distance_patient_clinic,
          durationMins
        )}</p>
        <p>Language Used: {ride.language}</p>
        {ride.time_margin < 0 && (
           <p>Waiting Time: {waitingHrs} h {waitingMins} m</p>
        )}
        {
          ride.time_margin > 0 && (
           <p>Late By:  {waitingHrs} h {waitingMins} m</p> 
          )
        }
        <p>Vehicle Plate Number: {ride.plate_number}</p>
        <p>Vehicle Brand: {ride.vehicle_name}</p>
      </Card.Body>
      <button
        style={{ backgroundColor: 'green' }}
        onClick={() => {   
           if(ride.time_margin > 0){
              Event.emit('OnWarning',{
                  title: "Late Appointment",
                  message: "Do not worry our team will make sure you get there as soon as possible. Do you want to book the appointment?",
                  positiveHandler: ()=>{onBook(ride)},
                  negativeHandler: ()=>{
                    //do nothing} 
            }}) 
          }  
          else 
          { 
             onBook(ride) 
          }
        }
          
        }
      >
        Book
      </button>
    </Card>
  );
}
export default function RideStep({
  appointmentDate,
  appointmentStartTime,
  appointmentEndTime,
  wheelchairNeeded,
  preferredLanguage,
  address,
  latitude,
  longitude,
  clinicId,
  onSkip,
  onCompleteRide
}) {
  const [rides, setRides] = useState([]);
  const [show, setShowModal] = useState(false);

  const startDatetimeInMs = new Date(
    `${appointmentDate}T${appointmentStartTime}`
  ).getTime();

  const endDatetimeInMs = new Date(
    `${appointmentDate}T${appointmentEndTime}`
  ).getTime();

  const handleRecommend = async (coords, mode = "Optimistic") => {
  try {
    const recommended = await API.getController("Ride").recommendRides(
      {
        appointment_start_time: startDatetimeInMs || Date.now() + 3600 * 1000,
        appointment_end_time: endDatetimeInMs || Date.now() + 10800 * 1000,
        userCoordinates: coords,
        destinationClinicId: clinicId,
        requiresWheelchair: wheelchairNeeded,
        preferredLanguage,
        mode,
      },
      {}
    );
    if (recommended && recommended.length > 0) {
      setRides(recommended);
      setShowModal(true);
    } else if (mode === "Optimistic") {
      // retry with pessimistic mode
      return handleRecommend(coords, "Pessimistic");
    } else {
      // no results even in pessimistic mode
      setRides([]);
      setShowModal(true);
    }
  } catch (err) {
    Event.emit("OnFailure", err.message);
  }
 };

  return (
    <div>
      <p><strong>Ride Booking</strong></p>
      <Container>
        <Row className="align-items-center" style={{ marginBottom: "2rem" }}>
          <Col sm={4}><p style={{ margin: 0 }}>Pickup From:</p></Col>
          <Col sm={8}>
            <FormSelect
              onChange={async e => {
                let coords = { lat: latitude, lng: longitude };
                const value = e.target.value;

                if (value === "Home Address") {
                  coords = await API.getController("location").getLocationCoordinates(address);
                } else if (value === "Test Coordinates") {
                  coords = { lat: 4.332495, lng: 101.1478746 };
                } else if (value === "Current Location") {
                  coords = { lat: latitude, lng: longitude };
                }

                if (value !== "--") {
                  handleRecommend({ latitude: coords.lat, longitude: coords.lng });
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

        {rides.length > 0 && (
          <RideListModal
            title={"Recommended Rides"}
            show={show}
            handleClose={() => setShowModal(false)}
          > 
            <strong>Appointment Start Time: {showFormattedTime(new Date(`${appointmentDate}T${appointmentStartTime}`))}</strong>
            <ListDisplayer data={rides}> 
             
              {(ride) => (
                <RideCard
                  ride={ride}
                  onBook={selected => {
                    handleRideBooking({
                      staff_id: selected.staff_id,
                      staff_vehicle_id: selected.vehicle_id,
                      ride_timestamp: new Date(selected.session_start_time).toISOString().slice(0, 19).replace("T", " "),
                      ride_end: new Date(selected.session_end_time).toISOString().slice(0, 19).replace("T", " "),
                      destination_clinic_id: clinicId
                    });
                    onCompleteRide();
                    setShowModal(false);
                  }}
                />
              )}
            </ListDisplayer>
          </RideListModal>
        )}
      </Container>
      <button style={{ marginTop: "4rem" }} onClick={onSkip}>Skip</button>
    </div>
  );
}