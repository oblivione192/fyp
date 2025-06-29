import { CgProfile,CgLogOut } from "react-icons/cg"; 
import { FaBell} from 'react-icons/fa'; 
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';  
import { setLoggedIn } from "./reducers/authReducer"; 
import { clearAll } from "./reducers/appointmentReducer";
import React from "react";
export default function MyProfileBar(){ 
  const navigate = useNavigate();   
  const dispatch = useDispatch(); 
  const username = useSelector(state => state.Profile.profile.fname); 
  
  const handleLogout = ()=>{ 
       sessionStorage.removeItem('loggedIn');     
       sessionStorage.removeItem('token');   

       localStorage.removeItem('token');  
       localStorage.removeItem('AppointmentCount');  
       localStorage.removeItem('rememberMe'); 
       dispatch(
          setLoggedIn(
            {
              loggedIn: false, 
              authToken: null, 
            }
          )
       ) 
       dispatch(
          clearAll()
       )
       navigate('/login'); 
  }
  return( 
    <React.Fragment>
      <div>
        <div className="topBar" style={{ display: 'flex', gap:'15px',alignItems: 'center', padding: '10px 20px' }}>
        <div style={{display:'flex',justifyContent:'center',flexDirection:'column'}}
         onClick={()=>{navigate('/profile')}}
        >
         <CgProfile style={{ width: '28px', height: '28px' }} />
         <p style={{ fontSize: '18px', margin: 0 }}>{username}</p> 
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