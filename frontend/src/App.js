import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MyProfileBar from './MyProfileBar.js';
import HomePage from './pages/user/MainMenu.js';
import React from 'react';
import Appointment from './pages/user/Appointment.js';
import BookAppointment from './pages/user/BookAppointment.js';
import Login from './Login.js';
import Register from './Register.js'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Entrance from './Entrance.js';
import { useNavigate, Outlet } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import { setLoggedIn } from './reducers/authReducer.js';
function Layout({ isLoggedIn, setLoggedIn }) {  
  const navigate = useNavigate();     
  useEffect(()=>{
      if(localStorage.getItem("rememberMe")){ 
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
              sessionStorage.setItem('token',localStorage.getItem('token')); 
              setLoggedIn(true); 
            }
            else navigate('/login');
         })
         .catch((err)=>{
            console.log(err); 
         })
      }
  },[localStorage.getItem('token'),navigate,setLoggedIn])
  const location = useLocation(); 
  const currentPath = location.pathname; 

  const isAuthPage = currentPath === '/login' || currentPath === '/register';

  console.log(currentPath);
  console.log("Hello from layout");

  if (!isLoggedIn && !isAuthPage) {
    // Always show Entrance, then redirect
    return (
      <>
        <Entrance />
        <Navigate to="/login" replace />
      </>
    );
  }

  return (
    <>
      {!isLoggedIn && <Entrance />}
      {isLoggedIn && <MyProfileBar setLoggedIn={setLoggedIn} />}
      <Outlet />
    </>
  );
}


export default function App() {   
  
  const [isLoggedIn, setLoggedIn] = useState(
    sessionStorage.getItem('loggedIn') === '1'
  );    
  console.log(isLoggedIn);  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />}>  
          <Route path="/home" element={<HomePage />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/book" element={<BookAppointment />} />  
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/home" replace /> : <Login setIsLoggedIn={setLoggedIn} />} 
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
