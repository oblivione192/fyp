import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  
import {Row, Col, Card, Container} from "react-bootstrap";
import API from "../../controllers";
import { showFormattedTime, showFormattedDate } from "../../util/Time";   
import { IoMdArrowBack } from "react-icons/io" ; 
import { CgCalendar } from "react-icons/cg";
import {  FaClock } from "react-icons/fa";  
import { FaMapMarkerAlt, FaNotesMedical } from 'react-icons/fa';
import { IoMdPerson } from "react-icons/io";
import { useSelector } from "react-redux";  
import {Table} from "react-bootstrap";

function AppointmentStatusChip({ status }) {
  return (
    <span className={`appointment-status-chip ${status?.toLowerCase()}`}>
      {status || "Unknown"}
    </span>
  );
}  


export default function AppointmentShow() {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const appointments = useSelector((state) => state.Appointment.appointments);

  useEffect(() => {
    const appointment = appointmentId ? appointments.find((a) => a.AppointmentId === parseInt(appointmentId)) : null;
    if (appointment) {
        setAppointment(appointment);
    }

    else{
      const appointmentController = API.getController("appointment"); 
      try{
        appointmentController.getAppointments(1,
          {
            option: "ById",
            AppointmentId: appointmentId 
          })
          .then((appointment) => {
          setAppointment(appointment);
        });
      } catch (error) {
        console.error("Error fetching appointment:", error); 
      }
    } 

  }, [appointmentId, appointments]);

  if (!appointment) {
    return <div>Loading...</div>;
  }

  return (
   <Container fluid className="p-4" style={{fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"}}>
      <Row className="justify-content-center">
        <Col md={8}> 
            <Card className="mt-3"> 
                <Card.Body>      
                     <div onClick={() => window.history.back()} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <IoMdArrowBack />
                        <span style={{ marginLeft: '0.5rem' }}>Back</span>
                    </div>
                  <Col className="mb-3">  
                    <Row> 
                        <h5><strong style={{marginRight:'1rem'}}>Appointment Summary</strong><span><AppointmentStatusChip status={appointment.confirmed ? "confirmed" : "pending"} /></span></h5> 
                    
                    </Row>       
                  </Col>
                    <Col className="mb-3" style={{border: "1px solid #ccc", borderRadius: "5px", padding: "15px"}}> 
                       <Table>
                          <tbody>  
                             <tr>
                               <td><span><CgCalendar className="me-2" style={{color: "#007bff"}} /></span><strong>Date</strong></td>
                               <td>{showFormattedDate(new Date(appointment.date))}</td>
                             </tr>
                             <tr>
                               <td><span><FaMapMarkerAlt className="me-2" style={{color: "#007bff"}} /></span><strong>Clinic Address</strong></td>
                               <td>{appointment.address}</td>
                             </tr>
                             <tr>
                               <td><span><IoMdPerson className="me-2" /></span><strong>Doctor Name</strong></td>
                               <td>{appointment.doctorName}</td>
                             </tr>
                            
                             <tr>
                               <td><span><FaClock className="me-2" style={{color: "#007bff"}} /></span><strong>Time</strong></td>
                               <td>{showFormattedTime(new Date(`${appointment.date}T${appointment.startTime}`))}</td>
                             </tr>   
                             <tr>
                                <td><span><FaNotesMedical className="me-2" style={{color: "#007bff"}} /></span><strong>Reason</strong></td>
                                <td>{appointment.visit_purpose}</td>
                             </tr>
                          </tbody>
                       </Table>
                    </Col>
                </Card.Body>
            </Card>
        </Col>
      </Row>
   </Container>
  );
}