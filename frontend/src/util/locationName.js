import API from "../controllers";
const getLocationName = ( latitude, longitude) => {
  // This is a placeholder function. In a real application, you would use a geocoding API.
  // For example, you could use the Google Maps Geocoding API or OpenCage Geocoder.
  // Here, we'll just return a mock location name for demonstration purposes.
  const fetchLocationName = async () =>{ 
     try{
       API.getController('location')
       .getLocationName(latitude,longitude) 
       .then((data)=>{  
          if(data.error) throw new Error(data.error);  
          return data.locationName; 
       }) 
       .catch((err)=>{
          throw err; 
       })
     }
     catch(err){ 
         return err.message;    
     }
  } 
    return fetchLocationName();
} 
export default getLocationName;