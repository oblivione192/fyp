import { configureStore } from "@reduxjs/toolkit";  
import authReducer from "./authReducer.js";
import AppointmentsReducer from "./appointmentReducer.js"
const store = configureStore({
    reducer:{
      Appointment : AppointmentsReducer,
      Auth : authReducer
    }
}) 

export default store; 