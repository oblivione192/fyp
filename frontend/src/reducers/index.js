import { configureStore } from "@reduxjs/toolkit";  
import authReducer from "./authReducer.js";
import AppointmentsReducer from "./appointmentReducer.js"; 
import hrReducer from './healthRecordReducer.js'
import profileReducer from "./profileReducer.js"
const store = configureStore({
    reducer:{
      Appointment : AppointmentsReducer,
      Auth : authReducer,
      Health: hrReducer,
      Profile: profileReducer
    }
}) 

export default store; 