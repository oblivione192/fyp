import { createSlice } from "@reduxjs/toolkit";

const initialState =
{
    isLoggedIn: false,
    authToken: ''
} 

const authReducer= createSlice(
    {
        name: 'Auth',
        initialState:initialState,
        reducers:{
            setLoggedIn: function(state,action){
              state.isLoggedIn = action.payload.loggedIn;
              state.authToken = action.payload.authToken; 
            }
        }
    }
) 

export const {setLoggedIn} = authReducer.actions;  

export default authReducer; 