import { createSlice } from "@reduxjs/toolkit";  
import API from "../controllers"; 
const initialState = {
      longitude: null, 
      latitude: null, 
      place_name: null,
      errors: null 
} 

const locationSlice = createSlice({
     initialState,
     name: 'Location', 
     reducers:{
         setLocation: (state,action)=>{
               state.longitude = action.payload.longitude;
               state.latitude =  action.payload.latitude; 
               state.place_name = action.payload.place_name; 
         }, 
         setError: (state,action)=>{
              state.errors = action.payload.error 
         }
     } 
}) 

export const { setLocation, setError } = locationSlice.actions;
export default locationSlice.reducer; 

export const getUserLocation = () => {
  return (dispatch) => { 
    
    if (!navigator.geolocation) {
      dispatch(setError("Geolocation is not supported by this browser"));
      console.log("Geolocation is not supported?"); 
      return;
    }

    const successHandler = (position) => {
      const { latitude, longitude } = position.coords; 
    
      API.getController("location")
      .getLocationName(latitude,longitude)
      .then((place_name)=>{
          dispatch(setLocation({ latitude, longitude, place_name })); 
      })

    };

    const errorHandler = (err) => {
      dispatch(setError(err.message)); 
      console.log(err.message); 
      return; 
    };

    navigator.geolocation.watchPosition(successHandler, errorHandler);
  };
};