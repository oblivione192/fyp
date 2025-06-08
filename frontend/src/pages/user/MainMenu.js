import * as React from 'react';
import { FaClipboard,FaCalendarCheck, FaClock,FaVial} from 'react-icons/fa';
import { useState,useEffect } from 'react'; 
import { useNavigate,useLocation } from 'react-router-dom'; 
import OptionBox from '../../components/OptionBox';
function Clock(){ 
   const showFormattedDate = function(){ 
      const now = new Date();
      const formattedDate = now.toLocaleDateString(undefined, {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric'
      }); 

      return formattedDate;
     } 
   const showFormattedTime = function(){  
      const now = new Date();
      const formattedTime = now.toLocaleTimeString(undefined, {
         hour: '2-digit',
         minute: '2-digit',
         hour12: true // Set to false for 24-hour format
      });
      return formattedTime; 
   }

   const [todayDate, setTodayDate] = useState(showFormattedDate()); 
   const [timeNow, setTimeNow]= useState(showFormattedTime());  

   setInterval(()=>{
      setTodayDate(showFormattedDate());
      setTimeNow(showFormattedTime()); 
   },1000)

   return(
    <div id="todaysDate" > 
      
      <p><FaClock />{" "+todayDate}</p>
      <p>{timeNow}</p>
    </div>
   )
}


function HomePage() {    
    const navigate = useNavigate();  
    const location = useLocation(); 
    const gotoAppointments = () => {
        navigate('/appointment');
    };
     useEffect(() => {
            if (location.pathname === '/home') {
                document.body.style.backgroundImage = 'none';
                document.body.style.backgroundColor = '#b6a8f0';
                document.body.style.backgroundRepeat = '';
                document.body.style.backgroundSize = '';
                document.body.style.backgroundPosition = '';
            }
        }, [location]);
    return (  
        <div>
            <Clock />
            <div className="gridMenu">     
                  <OptionBox 
                     style={
                        {
                           backgroundColor:"#9370DB",
                           fontSize:"20px"
                        }
                     }
                     IconComponent={FaCalendarCheck} 
                     text="Book An Appointment" 
                     onClick={gotoAppointments}
                  />  
                <OptionBox 
                    style={
                     {
                        backgroundColor:"#81ed7e",
                     }
                    } 
                    IconComponent={FaClipboard} 
                    text="My Medical Records"
                />
                <OptionBox 
                    style={  
                     {
                     backgroundColor:"#eb2f3f",
                 
                    }
                  }
                    IconComponent={FaVial} 
                    text="Test Results"
                />
            </div>
        </div>
    );
}


export default HomePage;
