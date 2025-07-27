import { useState } from "react"; 
import { FaClock } from "react-icons/fa";
import useTime from "../hooks/useTime";
export default function Clock(){   
   const{todayDate, timeNow} = useTime();
   return(
    <div id="todaysDate" > 
      
      <p><FaClock />{" "+todayDate}</p>
      <p>{timeNow}</p>
    </div>
   )
}