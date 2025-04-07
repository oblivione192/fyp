import React from "react";
import { useEffect } from "react"; 
import { useNavigate, Outlet, useLocation } from "react-router-dom";
export default function Entrance(){   
  const navigate = useNavigate();  
  const location = useLocation();  

  useEffect(() => {
      const isRemembered = localStorage.getItem("rememberme");  

      if (!isRemembered && location.pathname === "/") {
          console.log("Who are you?");
          navigate('/login');
      }
  }, [navigate, location]);  

    return( 
     <React.Fragment>
       <p id="welcome">Welcome to EasyMed Appointment</p>   
       <Outlet/>
     </React.Fragment>
    )
}