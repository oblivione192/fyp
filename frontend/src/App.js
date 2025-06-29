import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import MyProfileBar from './MyProfileBar.js';
import Home from './HomePage.js';
import Appointment from './pages/user/Appointment.js';
import BookAppointment from './pages/user/BookAppointment.js'; 
import HealthRecord from './pages/user/HealthRecord.js'; 
import PatientProfile from './pages/user/PatientProfile.js'; 
import MedicationPage from './pages/user/Medications.js'; 
import Login from './Login.js';
import Register from './Register.js'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Entrance from './Entrance.js';
import { useNavigate, Outlet } from 'react-router-dom'; 
import { useSelector,useDispatch} from 'react-redux'; 
import { expireSession } from './reducers/authReducer.js';
import { setLoggedIn } from './reducers/authReducer.js';   
import {AdminLogin} from './pages/admin'; 
import PrivateRoute from './components/PrivateRoute.jsx';


function Layout() {  
  const navigate = useNavigate();     
  const dispatch = useDispatch();   
  const isLoggedIn =  useSelector(state=>state.Auth.isLoggedIn);
  const authToken = useSelector(state=>state.Auth.authToken); 
  const role = useSelector(state => state.Auth.role);

  useEffect(()=>{
      if(localStorage.getItem("token")){ 
         fetch('/auth/user/checkTokenExpiry',
          {
            method:'POST', 
            headers: {
               "Content-Type":"application/json"
            },
            body:JSON.stringify({
               token : localStorage.getItem('token')
            })
          }
         )
         .then((response)=>{ 
            return response.json(); 
         }) 
         .then((result)=>{
            if(result.status==='Valid') {  
              dispatch(setLoggedIn({
                loggedIn: true,
                authToken: localStorage.getItem('token'),
                role: 'user'
              })) 
            }
            else { 
              dispatch(
                expireSession()
              ) 

              navigate('/login')
            };
         })
  
         .catch((err)=>{
            console.log(err); 
         })
      }
  },[navigate,dispatch,authToken]) 

  // if (!isLoggedIn && !isAuthPage) {
  //   // Always show Entrance, then redirect
  //   return (
  //     <>
  //       <Entrance />
  //       <Navigate to="/login" replace />
  //     </>
  //   );
  // }

  return (
    <>
      {!isLoggedIn ? 
      
      <><Entrance /><Outlet/></> :  
      <>
      <MyProfileBar/>
      <Outlet />
      </>
      } 
    </>
  );
}


export default function App() {   
  const isLoggedIn = useSelector(state => state.Auth.isLoggedIn); 
  return (
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<PrivateRoute><Home/></PrivateRoute>} /> 
          <Route path="/appointment" element={<PrivateRoute><Appointment /></PrivateRoute>} />
          <Route path="/book" element={<PrivateRoute><BookAppointment /></PrivateRoute>} />    
          <Route path="/healthRecord" element={<PrivateRoute><HealthRecord/></PrivateRoute>} />  
          <Route path="/profile" element={<PrivateRoute><PatientProfile/></PrivateRoute>}/>
          <Route path="/medication" element={<PrivateRoute><MedicationPage/></PrivateRoute>}/>   
          <Route 
           path="/adminLogin" element={isLoggedIn ? <Navigate to="/home" replace/> : <AdminLogin/>}/>
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
