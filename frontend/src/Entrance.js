import React from "react";

export default function Entrance(){   
  document.body.style.backgroundImage = "url('/homeimage.jpg')";
  document.body.style.backgroundPosition = "center";
    return( 
     <React.Fragment> 
       <div id="welcomeTopBar">
        <p id="welcome">Welcome to EasyMed Appointment</p>  
       </div>  
     </React.Fragment>
    )
}