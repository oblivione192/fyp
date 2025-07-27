
import { useState } from "react";
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

export default function useTime(){
     const [todayDate, setTodayDate] = useState(showFormattedDate()); 
     const [timeNow, setTimeNow] = useState(showFormattedTime()); 
     setInterval(()=>{
          setTodayDate(showFormattedDate()); 
          setTimeNow(showFormattedTime()); 
     })

     return {todayDate, timeNow}
}

