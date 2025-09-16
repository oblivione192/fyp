export default class LocationController {
    // Example method to get location data
    constructor(headers){ 
          this.headers = headers; 
    } 

    async getLocationName(latitude, longitude){
        const locationData = await fetch(`/api/location/getLocationName?latitude=${latitude}&longitude=${longitude}`,
        {
            headers: this.headers
        })
        .then((resp)=>{
            return resp.json();
        }) 
        return locationData; 
    } 

    async getLocationCoordinates(location_name){ 
         const params =  new URLSearchParams({
             locationName:location_name
         })
         const response = await fetch( `/api/location/getLocationCoordinates?${params.toString()}`,
        {
            headers: this.headers 
        }) 
         const locationCoordinates = await response.json(); 
         return locationCoordinates; 
    }
} 