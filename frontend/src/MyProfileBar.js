import { CgProfile,CgLogOut } from "react-icons/cg"; 
import { FaBell} from 'react-icons/fa'; 
import {useNavigate} from 'react-router-dom';
import React from "react";
export default function MyProfileBar({setLoggedIn}){ 
  const navigate = useNavigate();   
 
  const handleLogout = ()=>{ 
       sessionStorage.removeItem('loggedIn');     
       sessionStorage.removeItem('token'); 
       localStorage.removeItem('rememberMe'); 
       setLoggedIn(false); 
       navigate('/login'); 
  }
  return( 
    <React.Fragment>
      <div>
        <div className="topBar" style={{ display: 'flex', gap:'15px',alignItems: 'center', padding: '10px 20px' }}>
        <div style={{display:'flex',justifyContent:'center',flexDirection:'column'}}>
         <CgProfile style={{ width: '28px', height: '28px' }} />
         <p style={{ fontSize: '18px', margin: 0 }}>Your Profile</p> 
         </div>
          
          
          <FaBell style={{ width: '24px', height: '24px' }} /> 
          <div>
              <CgLogOut style={{width: '24px', height: '24px'}} onClick= {handleLogout} /> 
              <p style={{ fontSize: '18px', margin: 0 }}>Log Out</p> 
          </div>
         
          
       </div>
    </div>  
   </React.Fragment>
  )
}