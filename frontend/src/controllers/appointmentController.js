
class AppointmentController{  
   constructor(headers){
     this.headers = headers;
   } 
   async addAppointment(data){
     const response = await fetch('/api/appointment/addAppointment',
      { 
        method: "POST", 
        headers: this.headers,
        body: JSON.stringify(data)
      }
    ) 
    const result = await response.json(); 
    return result; 
   }
   async postponeAppointment(AppointmentId,SlotId,newStartTime,newEndTime){  
        
        const result = await fetch("/api/appointment/postponeAppointment",
          {
            method:'POST',
            headers:this.headers,
            body:JSON.stringify(
               { 
                 AppointmentId: AppointmentId,
                 SlotId: SlotId,
                 newStartTime: newStartTime,
                 newEndTime: newEndTime,
               }
            )
          }
        )
        return result; 
   }
   async cancelAppointment(AppointmentId){
   const result = await fetch("api/appointment/deleteAppointment",
    {
      method:'POST',
      headers: this.headers,
      body:JSON.stringify({AppointmentId: AppointmentId})
    }
   ) 
   return result; 
   }
     async getAppointmentCount({isModifiedInBackend}){   
          if(!localStorage.getItem("AppointmentCount") || 
             isModifiedInBackend
          ){
              const totalAppointments = await fetch("/api/appointment/count",
                  {
                      headers:this.headers
                  }
              ) 
              .then((resp)=>{
                  return resp.text(); 
              })
              .then((result)=>{ 
                localStorage.setItem("AppointmentCount",result); 
                return result.totalAppointments
              }) 
              return totalAppointments;
          }
          else{
             return localStorage.getItem("AppointmentCount"); 
          }
    }
     async getAppointmentHistory(page){
      const appointments = await fetch("/api/appointment/appointmentHistory?page="+page,
        {
            headers: this.headers
        } 
        )
        .then((resp)=>{
            return resp.json(); 
        })
        .then((data)=>{
            return data; 
        }) 

        return appointments; 
    } 
     async getPendingAppointments(page){
      const appointments =  await fetch("/api/appointment/pendingAppointments?page="+page,

          {
            headers: this.headers
          }
        )
        .then((resp)=>{
            return resp.json();
        })
        .then((data)=>{
           return data
        }) 
        return appointments; 
    } 
     async getUserAppointments(page){
      const appointments =  await fetch("/api/appointment/getAppointment?option=BySelf&page="+page,
        {
           headers : this.headers
        }
      )
      .then((resp)=>{
        return resp.json(); 
      }) 
      .then((data)=>{
        return data
      }) 

      return appointments;
    }
     async getUpcomingAppointments(page){  

      const appointments = fetch("/api/appointment/confirmedAppointments?page="+page,
            {
               headers: this.headers
            }
        )
        .then((resp)=>{
            return resp.json();
        }) 
        .then((data)=>{
            return data; 
        }) 

        return appointments; 
    }
     async getServices(){ 
      const response = await fetch('/api/appointment/getServices',
           {
             method:'GET',
             headers: this.headers
           }
         ) 
       const services = await response.json(); 
       return services; 
    } 
     async getUpcomingSlots(clinicId){
         const response = await fetch(`/api/appointment/getSlots?clinicId=${clinicId}&option=Upcoming`,
            {
                method:'GET',
                headers:this.headers
            } 
         );  
         const slots = await response.json(); 
         return slots; 
    }
    
} 
export default AppointmentController; 