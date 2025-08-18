
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
     async getAppointmentCount(options){   
          if(!localStorage.getItem("AppointmentCount") ||
             options.resync
        ){ 
              const query = new URLSearchParams(options)
              const totalAppointments = await fetch(`/api/appointment/count?${query}`,
                  {
                      headers:this.headers
                  }
              ) 
              .then((resp)=>{
                  return resp.text(); 
              })
              .then((result)=>{ 
                localStorage.setItem("AppointmentCount",result); 
                return result
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

    async getAppointments(page,option){ 
     const query = new URLSearchParams(option);  
     console.log(this.headers); 
     const appointments = await fetch(`/api/appointment/getAppointment?${query}&page=${page}`,
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
     .catch((err)=>{
       console.error(err);  
       return []; 
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
   async confirmAppointment(data) {
  try {
    const updateResponse = await fetch(`/api/appointment/updateAppointment`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        AppointmentId: data.AppointmentId,
        field: "DoctorId",
        newValue: data.DoctorId
      })
    });

    const updateJson = await updateResponse.json();

    if (!updateJson || updateJson.status !== 'success') {
      throw new Error('Failed to update appointment.');
    }

    const confirmResponse = await fetch(`/api/appointment/confirmAppointment`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify({
        AppointmentId: data.AppointmentId
      })
    });

    const confirmJson = await confirmResponse.json();

    return confirmJson.status;

  } catch (err) {
    console.error("Appointment confirmation failed:", err);
    throw err;  // or: return { status: 'error', message: err.message };
  }
}
    async setAppointmentAttended(AppointmentId,attended){
       const response= await fetch(`/api/appointment/updateAppointment`,{
         method: 'POST', 
         headers: this.headers,
         body: JSON.stringify({
            AppointmentId: AppointmentId,
            field: "attended",
            newValue: attended
         })
       })
       .then((resp)=>{
          return resp.json(); 
       }) 

       if(response.status === "success"){
         return "OK"; 
       }
       else{
        return response.message; 
       }
    }
    async addClinicSlot(data){
       const response = await fetch(`/api/appointment/addClinicSlot`,
        {
          method:'POST',
          headers:this.headers,
          body:JSON.stringify({
             slotDate: data.slotDate,
             startTime: data.startTime,
             endTime: data.endTime
          })
        }
       ).then((response)=>{
         return response.json(); 
       }) 
      if(response.status==="Success"){
         return response; 
      } 
      else{ 
         return response.message;  
      }
    }
    async deleteClinicSlot(slotId){
       const response = await fetch(`/api/appointment/deleteSlot/${slotId}`,
        {
          method:'DELETE',
          headers: this.headers
        }
       )
       .then((resp)=>{
         return resp.json() 
       }) 
      
        return response; 
    }
} 

export default AppointmentController; 