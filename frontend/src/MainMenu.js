import * as React from 'react';
import { FaUserFriends, FaCalendarCheck, FaCar, FaPills, FaClock } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { useState } from 'react';
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
      
      <p><FaClock className='icon'/>{" "+todayDate}</p>
      <p>{timeNow}</p>
    </div>
   )
}
function HomePage(){    
   
  
  return(  
   <div>
    <div className="topBar">  
      <div className="profileSection">
        <CgProfile style={{width:'64px',height:'64px'}}/> 
        <p style={{fontSize:'24px'}}>Your Profile</p>  
       </div> 
    </div> 

    
    <div className="gridMenu">   
      <div className="optionBox" style={{backgroundColor:'#4A90E2'}}>
        <FaUserFriends className="icon" />
        <p className="buttonText">My Family</p>
      </div>
      <div className="optionBox" style={{backgroundColor:'#6FAF98'}}>
        <FaPills className="icon" />
        <p className="buttonText">My Medications</p>
      </div>
      <div className="optionBox" style={{backgroundColor:'#FF6F61'}}>
        <FaCar className="icon" />
        <p className="buttonText">My Rides</p>
      </div>
      <div className="optionBox" style={{backgroundColor:'#9370DB'}}>
        <FaCalendarCheck className="icon" />
        <p className="buttonText">My Appointments</p>
      </div>
   </div>
   <Clock/>
   
   <div className="contactList">
       <div className="profileCard">
          <CgProfile style={{width:'52px',height:'52px'}}/> 
          <p>John Doe</p>
       </div> 
       <div className="profileCard">
          <CgProfile style={{width:'52px',height:'52px'}}/> 
          <p>John Doe</p>
       </div>  
       <div className="profileCard">
          <CgProfile style={{width:'52px',height:'52px'}}/> 
          <p>John Doe</p>
       </div> 
       <div className="profileCard">
          <CgProfile style={{width:'52px',height:'52px'}}/> 
          <p>John Doe</p>
       </div> 
       <div className="profileCard">
          <CgProfile style={{width:'52px',height:'52px'}}/> 
          <p>John Doe</p>
       </div>  
       <div className="profileCard">
          <CgProfile style={{width:'52px',height:'52px'}}/> 
          <p>John Doe</p>
       </div> 
    </div>
  </div>
  )
}

export default HomePage;
