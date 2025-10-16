
import { FaCalendarCheck, FaPills, FaNotesMedical, FaCar } from 'react-icons/fa';
import { useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom'; 
import OptionBox from '../../components/OptionBox'; 
import API from '../../controllers';
import { useSelector, useDispatch } from 'react-redux';  
import { initProfile } from '../../reducers/profileReducer'; 
import { motion } from 'framer-motion';

import useProfile from '../../hooks/useProfile';  
import calculateAge from '../../util/calculateAge';
import useTime from '../../hooks/useTime';

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
            className="title"
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
         >
           Welcome {fname} and Good {getGreetings()} 
         </motion.p>  

         <div>  
              <motion.p 
                custom={1} 
                variants={fadeUp} 
                initial="hidden" 
                animate="visible"
              >
                {timeNow}
              </motion.p>

              <motion.p 
                custom={2} 
                variants={fadeUp} 
                initial="hidden" 
                animate="visible"
              >
                {todayDate}
              </motion.p>

              <motion.p 
                custom={3} 
                variants={fadeUp} 
                initial="hidden" 
                animate="visible"
              >
                Live well and healthy in your <span style={{color:'#FFD700'}}>golden</span> years with EasyMed
              </motion.p>
         </div>  
      </div>
    )
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
         console.log(API.getHeaders()); 
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

    // Framer Motion fade-up variant
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

            <div className="gridMenu">     
                  <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
                    <OptionBox 
                      style={{ backgroundColor:"#9370DB" }}  
                      IconComponent={FaCalendarCheck} 
                      text="Book An Appointment" 
                      onClick={gotoAppointments}
                    />  
                  </motion.div>

                  <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
                    <OptionBox 
                      style={{ backgroundColor:"#388635ff" }} 
                      IconComponent={FaNotesMedical} 
                      text="My Health Records" 
                      onClick={gotoHealthRecords}
                    />  
                  </motion.div>

                  <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
                    <OptionBox 
                      style={{ backgroundColor:"#FF474C" }} 
                      IconComponent={FaPills} 
                      text="My Medications"
                      onClick={gotoMedications}
                    /> 
                  </motion.div>

                  <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
                    <OptionBox  
                      style={{ backgroundColor:"#8e9107ff" }} 
                      IconComponent={FaCar} 
                      text="Rides"
                      onClick={gotoRides}
                    />
                  </motion.div>
            </div>
        </div>
    );
}

export default HomePage;