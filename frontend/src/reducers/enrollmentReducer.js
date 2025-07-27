import { createSlice } from "@reduxjs/toolkit"; 
const initialState= { 
    enrollments : [],  
    isInit: false, 
} 
 
const Enrollment = createSlice({
     name: 'Enrollment', 
     initialState:initialState,
     reducers:{ 
        addEnrollment: function(state,action){ 
         
            state.enrollments.push(action.payload)
        
          
        },  
        initEnrollment : function(state,action){  
            if(!state.isInit){
             state.enrollments.push(...action.payload) 
             state.isInit= true; 
            }
           
        }, 
        addEnrollments : function(state,action){
            state.enrollments.push(...action.payload); 
           
        },  
        updateEnrollment: function(state,action){
             
        }, 
        removeEnrollment: function(state,action){
             
        }, 

     }
}) 
 
export const {initEnrollment, addEnrollment,addEnrollments,updateEnrollment,removeEnrollment} = Enrollment.actions
export default Enrollment.reducer; 
