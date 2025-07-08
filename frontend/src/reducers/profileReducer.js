import { createSlice } from "@reduxjs/toolkit"; 

const initialState= {
     profile:{
         username:"", 
         email: ""
     },  
     init:false 
} 

const profileSlice = createSlice(
    {
         initialState, 
         name:"Profile",
         reducers: { 
             initProfile:  function(state,action){ 
                 Object.assign(state.profile,action.payload);  
                 state.init = true; 
             }, 
             clearProfile: function(state,action){ 
                 Object.assign(state,initialState); 

             },
             updateProfile: function(state,action){ 
                 Object.assign(state.profile,action.payload); 
             } 
         }
    }
) 

export const {initProfile, clearProfile, updateProfile} = profileSlice.actions; 
export default profileSlice.reducer; 