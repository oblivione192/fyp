
import {FaCalendarCheck, FaPills, FaNotesMedical, FaCar, FaCheck, FaArrowRight} from 'react-icons/fa';  
import { useEffect } from 'react';  
import { useNavigate, useLocation } from 'react-router-dom';  
import OptionBox from '../../components/OptionBox'; 
import API from '../../controllers';
import { useSelector, useDispatch } from 'react-redux';  
import { initProfile } from '../../reducers/profileReducer';   
import { motion } from 'framer-motion'; 
import { setNextAppointment } from '../../reducers/appointmentReducer';
import Card from 'react-bootstrap/Card'; 
import {Row, Col} from 'react-bootstrap';
import useProfile from '../../hooks/useProfile';  
import calculateAge from '../../util/calculateAge';
import useTime from '../../hooks/useTime';
import { showFormattedTime } from '../../util/Time';

function WelcomePanel(){ 
    const {fname} = useSelector(state => state.Profile.profile);   
    const {todayDate, timeNow} = useTime();  

    const getGreetings = function() {
      const now = new Date();
      const hour = now.getHours();

      if (hour >= 0 && hour < 12) {
         return "Morning";
      } else if (hour >= 12 && hour < 17) {
         return "Afternoon";
      } else {
         return "Evening";
      }
    };

    // Framer Motion fade-up variant
    const fadeUp = {
      hidden: { opacity: 0, y: 20 },
      visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" }
      })
    };

    return(
       <div id="greeting">
    <motion.p
      className="greeting-title"
      style={{ fontSize: '1.2rem', fontWeight: '600' }}
      custom={0}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      Welcome {fname} and Good {getGreetings()}!
    </motion.p>

    <div className="greeting-meta">
      <motion.p custom={1} variants={fadeUp} initial="hidden" animate="visible" style={{ fontSize: '0.9rem', color: '#ffffff' }}>
        {timeNow}
      </motion.p>

      <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible" style={{ fontSize: '0.9rem', color: '#fbf7f7' }}>
        {todayDate}
      </motion.p>
    </div>
  </div>
    )
}
 
function UpcomingAppointment(){
    const upcomingAppointment = useSelector(state => state.Appointment.nextAppointment);   
    const dispatch = useDispatch();     
    const navigate = useNavigate();

 
    useEffect(()=>{  
      async function fetchUpcomingAppointment(){
         if(upcomingAppointment ===  undefined){   //undefined is not equal to null, it means it has not been fetched yet.
              try{ 
                  const upcomingAppointments = await API.getController("appointment").getUpcomingAppointments(1);  
                  console.log("Fetched upcoming appointments: ", upcomingAppointments); 
                  if(upcomingAppointments.length > 0){ 
                     return upcomingAppointments[0];
                  }
              } 
              catch(err){
                  return null; 
              }
         }   
         else if(upcomingAppointment){
              return upcomingAppointment;
          } 
          else{
              return null; 
          }
      }
   
       console.log("Fetching upcoming appointment...")
       fetchUpcomingAppointment()
       .then((appointment)=>{ 
          if(appointment) dispatch(setNextAppointment(appointment));  
          else dispatch(setNextAppointment(null)); 
       })  

        
    },[upcomingAppointment, dispatch])  

   if(upcomingAppointment ===  undefined){ 
       return <p></p>
    }  

    return (
        <div>
          {upcomingAppointment ? (
            <div id="upcomingAppointment">

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.45, ease: "easeOut" }}
                style={{ marginBottom: "0.2rem" }}
              >
                <FaCheck style={{ color: "green", marginRight: 6 }} />
                Next Appointment Today
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.45, duration: 0.55, ease: "easeOut" }}
              >
                <Card
                  style={{
                    height: "4.4rem",
                    width: "100%",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    zIndex: 1,
                    borderRadius: "1.8rem",
                  }}
                >
                  <Card.Body style={{ padding: "0.8rem 1rem" }}>
                    <Row className="align-items-center">
                      <Col xs="auto">
                        <FaNotesMedical size={22} style={{ color: "#2F6F4F" }} />
                      </Col>

                      <Col>
                        <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                          {upcomingAppointment.doctorName}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                          {showFormattedTime(new Date(`${upcomingAppointment.date}T${upcomingAppointment.startTime}`))}
                        </div>
                      </Col>

                      <Col xs="auto">
                        <div  
                          onClick={() => navigate(`/appointment/${upcomingAppointment.AppointmentId}`)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#2F6F4F",
                            cursor: "pointer",
                          }}
                        >
                          View Details
                          <FaArrowRight size={12} />
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </motion.div>

            </div>
          ) : (  
            <div id="upcomingAppointment">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.45, ease: "easeOut" }}
                style={{ marginBottom: "0.2rem" }}
              >
                  No Upcoming Appointments Today
              </motion.p>
            </div>
          )}
        </div>
      );

}  




function HomePage() {    
    const navigate = useNavigate();  
    const location = useLocation();    
    const dispatch = useDispatch();  
    const getProfile = useProfile(); 
    const isInit = useSelector(state => state.Profile.init);  
    const authToken = useSelector(state=> state.Auth.authToken);  

    const gotoAppointments = () => navigate('/appointment'); 
    const gotoMedications = () => navigate('/medication');
    const gotoHealthRecords = () => navigate('/healthRecord'); 
    const gotoRides = () => navigate('/rides');

    useEffect(()=>{   
      if(!isInit){ 
         getProfile('User')
         .then((profile)=>{  
            const userAge = calculateAge(profile.icnumber);
            dispatch(initProfile({...profile,age:userAge})) 
         })
         .catch((err)=>{
            console.error(err); 
         }) 
      }
    },[isInit,dispatch,authToken,getProfile]);   

   
    const fadeUp = {
      hidden: { opacity: 0, y: 20 },
      visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" }
      })
    };

   

    return (  
        <div>
            <WelcomePanel/>
             <UpcomingAppointment/>
       
            <div className="gridMenu" style={{
              backgroundColor:"#d6e0ea", 
              padding: '1rem', 
              borderRadius: '10px', 
              height: 'fit-content',
            }}>     
                  <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
                    <OptionBox 
                      style={{ backgroundColor:"#8cb6db", color:"#1F2D3D", width: '9rem', height: '9rem', fontSize: '1.0rem' }}  
                      IconComponent={FaCalendarCheck} 
                      text="Book An Appointment" 
                      onClick={gotoAppointments}
                    />  
                  </motion.div>

                  <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
                    <OptionBox 
                      style={{ backgroundColor:"#a2d990", color:"#1f2d3d",width: '9rem', height: '9rem', fontSize: '1.0rem'  }} 
                      IconComponent={FaNotesMedical} 
                      text="My Health Records" 
                      onClick={gotoHealthRecords}
                    />  
                  </motion.div>

                  <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
                    <OptionBox 
                      style={{ backgroundColor:"#9FB8D9",  color:"#22313f", width: '9rem', height: '9rem', fontSize: '1.0rem' }} 
                      IconComponent={FaPills} 
                      text="My Medications"
                      onClick={gotoMedications}
                    /> 
                  </motion.div>

                  <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
                    <OptionBox  
                      style={{ backgroundColor:"#D9B38C", color:"#3a2f28", width: '9rem', height: '9rem', fontSize: '1.0rem' }} 
                      IconComponent={FaCar} 
                      text="Clinic Transport"
                      onClick={gotoRides}
                    />
                  </motion.div>
            </div>
        </div>
    );
}

export default HomePage;