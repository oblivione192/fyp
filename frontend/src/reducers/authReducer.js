import { createSlice } from "@reduxjs/toolkit";

const initialState =
{
    isLoggedIn: false,
    authToken: null, 
    userRole: '', 
    sessionExpired: false
} 

const authReducer= createSlice(
    {
        name: 'Auth', 
        initialState:initialState,
        reducers:{
            setLoggedIn: function(state,action){
              state.isLoggedIn = action.payload.loggedIn;
              state.authToken = action.payload.authToken;
              state.userRole = action.payload.role; 
            } , 
            
            expireSession: function(state,action){
                state.sessionExpired = true; 
                state.isLoggedIn = false; 
                state.authToken = null; 
            } 
        }
    }
) 

export const {setLoggedIn,expireSession} = authReducer.actions;  

export default authReducer.reducer; 