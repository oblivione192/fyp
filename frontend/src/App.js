import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Profile from './Profile.js';
import MyProfileBar from './MyProfileBar.js';
import Home from './HomePage.js';
import Appointment from './pages/user/Appointment.js';
import BookAppointment from './pages/user/BookAppointment.js'; 
import HealthRecord from './pages/user/HealthRecord.js'; 
import PatientProfile from './pages/user/PatientProfile.js'; 
import MedicationPage from './pages/user/Medications.js';  
import SlotManagement from './pages/admin/SlotManagement';   
import AppointmentShow from './pages/user/AppointmentShow.js';

import Login from './Login.js'; 
import Register from './Register.js';
import RidesPage from './pages/user/MVARides.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Entrance from './Entrance.js'; 
import PatientAppointments from './pages/admin/PatientAppointments.js'; 
import { useContext, useCallback} from 'react';
import { useNavigate, Outlet } from 'react-router-dom'; 
import { useSelector,useDispatch} from 'react-redux'; 
import { expireSession } from './reducers/authReducer.js';
import { setLoggedIn } from './reducers/authReducer.js';   
import {AdminLogin} from './pages/admin';     
import AdminLayout from './pages/admin/AdminLayout.js'; 
import PrivateRoute from './components/PrivateRoute.jsx'; 



function Layout() {
  const navigate = useNavigate();     
  const dispatch = useDispatch();   
  const isLoggedIn = useSelector(state => state.Auth.isLoggedIn);
  const authToken = useSelector(state => state.Auth.authToken);  
  const userRole = useSelector(state => state.Auth.userRole);  

  

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetch('/auth/user/checkTokenExpiry', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: localStorage.getItem('token') })
        
      }) 
      .then(response => response.json())
      .then(result => {
        if (result.status === 'Valid') {
          dispatch(setLoggedIn({
            loggedIn: true,
            authToken: localStorage.getItem('token'),
            role: 'user'
          }));
        } else {
          dispatch(expireSession());
          navigate('/login');
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
  }, [navigate, dispatch, authToken]);

  // This logic decides whether to show Entrance or MyProfileBar
  const showEntrance = !isLoggedIn;
  const isAdmin = userRole === 'admin'
  return (
    <>
      {showEntrance ? <Entrance /> : <MyProfileBar />} 
      {isAdmin && <AdminLayout/> }
      <Outlet />
    </>
  );
}

function AppRouter(){  
  const isLoggedIn = useSelector(state => state.Auth.isLoggedIn);  
   const location = useLocation();  
   const authRoute = ['/login','/register','/adminLogin' ]
   if(!isLoggedIn && !authRoute.includes(location.pathname)){
      return <Navigate to="/login"/> 
   } 
   if(isLoggedIn && authRoute.includes(location.pathname)){
     return <Navigate to={location.pathname}/> 
   }
   else{
     return <><Navigate to={location.pathname}/></>
   }
}
export default function App() {   
  const isLoggedIn = useSelector(state => state.Auth.isLoggedIn);  
  const userRole = useSelector(state => state.Auth.userRole);  
 
  return ( 
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<><Layout/><AppRouter/></>}>  
          <Route path="/slots" element={<PrivateRoute role="admin"><SlotManagement/></PrivateRoute>}/>
          <Route path="/home"  element={<PrivateRoute role={userRole}><Home/></PrivateRoute>} />  
          <Route path="/appointment" element={<PrivateRoute role="user"><Appointment /></PrivateRoute>} />   
          <Route path="/appointment/:appointmentId" element={<PrivateRoute role="user"><AppointmentShow/></PrivateRoute>} />
          <Route path="/patientAppointment" element={<PrivateRoute role="admin"><PatientAppointments/></PrivateRoute>}/>
          <Route path="/book" element={<PrivateRoute role="user"><BookAppointment /></PrivateRoute>} />    
          <Route path="/healthRecord" element={<PrivateRoute role="user"><HealthRecord/></PrivateRoute>} />  
          <Route path="/profile" element={<PrivateRoute role={userRole}><Profile/></PrivateRoute>}/>
          <Route path="/medication" element={<PrivateRoute role="user"><MedicationPage/></PrivateRoute>}/>   
          <Route path="/rides" element={<PrivateRoute role="user"><RidesPage/></PrivateRoute>}/>
           <Route 
           path="/adminLogin" element={ isLoggedIn ?  <Navigate to="/home" replace/> : <AdminLogin/>}/>
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/home" replace /> : <Login/>} 
          />
          <Route 
            path="/register" 
            element={isLoggedIn ? <Navigate to="/home" replace /> : <Register />} 
          />
        </Route>
      </Routes> 
    </BrowserRouter>
  );
}
