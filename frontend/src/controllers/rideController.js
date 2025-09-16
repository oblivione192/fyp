export default class RideController{ 
       constructor(headers){
        this.Headers =  headers; 
       }
       
       async bookRide(rideData={}){  
              try{
              const response =  await fetch("/api/mva/ride/bookRide",{
                     method: 'POST', 
                     body: JSON.stringify(rideData), 
                     headers: this.Headers 
              })   
              const result = await response.json(); 
              
              if(result.status === "OK"){ 
                   return result; 
              } 

              return "Error"; 


              } 
              catch(err){ 
                 return new Error("Failed to book ride: "+err.message);
              }  

       } 

       async recommendRides(
              rideData={},
              options={}
       ){   
            

            try{ 
              console.log(rideData);  
              const rides =  await fetch("/api/mva/ride/recommendRides",{
                     method: "POST",
                     body: JSON.stringify({...rideData,options}),
                     headers: this.Headers
              }) 

              const rides_data =  await rides.json();  

              return rides_data.recommended_schedules;  
            } 
            catch(err){ 
                 return new Error(err.message); 
            }
       }
}