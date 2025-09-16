import * as React from 'react';
import { FaCalendarCheck, FaClock,FaVial, FaPills, FaNotesMedical, FaCar} from 'react-icons/fa';
import { useState,useEffect } from 'react'; 
import { useNavigate,useLocation } from 'react-router-dom'; 
import OptionBox from '../../components/OptionBox'; 
import API from '../../controllers';
import {useSelector,useDispatch} from 'react-redux';  
import { initProfile } from '../../reducers/profileReducer'; 
import Clock from '../../components/Clock';
import useProfile from '../../hooks/useProfile';  
import calculateAge from '../../util/calculateAge';

import {Row,Col} from 'react-bootstrap'


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
    const gotoRides = () =>{
       navigate('/rides')
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
                        backgroundColor:"#bfc42b"
                     }
                  } 
                  IconComponent={FaCar} 
                  text="Rides"
                  onClick={gotoRides}
                 />
            </div>
        </div>
    );
}


export default HomePage;
