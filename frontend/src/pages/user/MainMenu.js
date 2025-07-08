import * as React from 'react';
import { FaCalendarCheck, FaClock,FaVial, FaPills, FaNotesMedical} from 'react-icons/fa';
import { useState,useEffect } from 'react'; 
import { useNavigate,useLocation } from 'react-router-dom'; 
import OptionBox from '../../components/OptionBox'; 
import API from '../../controllers';
import {useSelector,useDispatch} from 'react-redux';  
import { initProfile } from '../../reducers/profileReducer'; 
import Clock from '../../components/Clock';
import useProfile from '../../hooks/useProfile';
function calculateAge(icnumber) {
  const birthYearLastTwoDigits = parseInt(icnumber.slice(0, 2), 10);
  const birthMonth = parseInt(icnumber.slice(2, 4), 10) - 1; 
  const birthDay = parseInt(icnumber.slice(4, 6), 10);


  const currentYear = new Date().getFullYear();
  const currentYearLastTwoDigits = currentYear % 100;

  let birthYear;
  if (birthYearLastTwoDigits > currentYearLastTwoDigits) {
    birthYear = 1900 + birthYearLastTwoDigits;
  } else {
    birthYear = 2000 + birthYearLastTwoDigits;
  }

  const birthDate = new Date(birthYear, birthMonth, birthDay);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}

function HomePage() {    
    const navigate = useNavigate();  
    const location = useLocation();    
    const dispatch = useDispatch();  
    const getProfile = useProfile(); 
    const isInit = useSelector(state => state.Profile.init);  
    const authToken = useSelector(state=> state.Auth.authToken);  
    const gotoAppointments = () => {
        navigate('/appointment');
    }; 
    const gotoMedications =() =>{
      navigate('/medication')
    }
    const gotoHealthRecords = () =>{
      navigate('/healthRecord'); 
    }  

    useEffect(()=>{   
      
      if(!isInit){ 
         console.log(API.getHeaders()); 
         getProfile('User')
         .then((profile)=>{  
            const userAge = calculateAge(profile.icnumber);
            dispatch(initProfile({...profile,age:userAge})) 
         })
         .catch((err)=>{
            console.error(err); 
         }) 
      }
    },[isInit,dispatch,authToken,getProfile])   
    
    

    return (  
        <div>
            <Clock />
            <div className="gridMenu">     
                  <OptionBox 
                     style={
                        {
                           backgroundColor:"#9370DB",
                           fontSize:"20px"
                        }
                     }
                     IconComponent={FaCalendarCheck} 
                     text="Book An Appointment" 
                     onClick={gotoAppointments}
                  />  
                <OptionBox 
                    style={
                     {
                        backgroundColor:"#81ed7e",
                     }
                    } 
                    IconComponent={FaNotesMedical} 
                    text="My Health Records" 
                    onClick={gotoHealthRecords}
                />  

                <OptionBox 
                    style={
                     {
                        backgroundColor:"#FF474C",
                     }
                    } 
                    IconComponent={FaPills} 
                    text="My Medications"
                    onClick={gotoMedications}
                /> 

                <OptionBox 
                    style={  
                     {
                     backgroundColor:"#eb2f3f",
                 
                    }
                  }
                    IconComponent={FaVial} 
                    text="Test Results"
                /> 
                 
            </div>
        </div>
    );
}


export default HomePage;
