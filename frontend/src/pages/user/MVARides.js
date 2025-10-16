import React, { useEffect, useState } from "react";
import { Button, Card, Container, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ListDisplayer from "../../components/ListDisplayer";
import API from "../../controllers";

function RideHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    API.getController("Ride")
      .getRides({
        dateStart: new Date(now - 7 * 86400 * 1000).toISOString(),
        dateEnd: new Date(now).toISOString(),
        withStaffDetails: true,
        withClinicDetails: true,
      })
      .then((rides) => {
        setRides(rides || []); // ensure it's always an array
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (rides.length === 0) {
    return <p className="title">Nothing to show</p>;
  }

  return (
    <>
      <p className="title">Rides over the past week</p>
      <ListDisplayer data={rides}>
        {(ride) => (
          <Card key={ride.ride_id} className="mb-2">
            <Card.Body>
              <strong>{new Date(ride.ride_timestamp).toLocaleDateString()}</strong>
              <div>Staff: {ride.staff_fname} {ride.staff_lname}</div>
              <div>Clinic: {ride.name}</div>
            </Card.Body>
          </Card>
        )}
      </ListDisplayer>
    </>
  );
}

export default function RidesPage() {
  const navigate = useNavigate();
  const backHome = () => navigate("/home");

  return (
    <Container>
      <Col>  
         <Button
          style={{ width: "20rem", marginTop: "1rem" }}
          onClick={backHome}
         >
          Back
        </Button>
        <RideHistory />
        
      </Col>
    </Container>
  ); 
}