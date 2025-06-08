
class AppointmentController{ 
   static async postponeAppointment(AppointmentId,SlotId,newStartTime,newEndTime){ 
        const result = await fetch("/api/appointment/postponeAppointment",
          {
            method:'POST',
            headers:{  
              "Content-Type":"application/json",
              "Authorization":`Bearer ${sessionStorage.getItem("token")}`,
            },
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
   static async cancelAppointment(AppointmentId){
   const result = await fetch("api/appointment/deleteAppointment",
    {
      method:'POST',
      headers:{ 
         "Authorization":`Bearer ${sessionStorage.getItem("token")}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({AppointmentId: AppointmentId})
    }
   ) 
   return result; 
   }
    static async getAppointmentCount({isModifiedInBackend}){   
          if(!localStorage.getItem("AppointmentCount") || 
             isModifiedInBackend
          ){
              const totalAppointments = await fetch("/api/appointment/count",
                  {
                      headers:{
                          "Authorization":`Bearer ${sessionStorage.getItem("token")}`
                      }
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
    static async getAppointmentHistory(page){
      const appointments = await fetch("/api/appointment/appointmentHistory?page="+page,
        {
            headers:{
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }
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
    static async getPendingAppointments(page){
      const appointments =  await fetch("/api/appointment/pendingAppointments?page="+page,

          {
            headers:{
                "Authorization" : `Bearer ${sessionStorage.getItem("token")}`
            }
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
    static async getUserAppointments(page){
      const appointments =  await fetch("/api/appointment/getAppointment?option=ByUser&page="+page,
        {
           headers : {
               "Authorization" : `Bearer ${sessionStorage.getItem("token")}`
           }
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
    static async getUpcomingAppointments(page){  

      const appointments = fetch("/api/appointment/confirmedAppointments?page="+page,
            {
                headers:{
                    "Authorization":`Bearer ${sessionStorage.getItem("token")}`
                }
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
    static async getServices(){ 
      const response = await fetch('/api/appointment/getServices',
           {
             method:'GET',
             headers:{
               "Authorization" : `Bearer ${sessionStorage.getItem("token")}`
             }
           }
         ) 
       const services = await response.json(); 
       return services; 
    } 
    static async getUpcomingSlots(clinicId){
         const response = await fetch(`/api/appointment/getSlots?clinicId=${clinicId}&option=Upcoming`,
            {
                method:'GET',
                headers:{
                  "Authorization" : `Bearer ${sessionStorage.getItem("token")}`
                }
            } 
         );  
         const slots = await response.json(); 
         return slots; 
    }
    
} 
export default AppointmentController; 