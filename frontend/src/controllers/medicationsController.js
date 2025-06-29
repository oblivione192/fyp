
export default class MedicationController{  
     constructor(headers){ 
         this.headers = headers;
     }

      async getPatientMedicals(){
         const medicals =  await fetch("/api/medication/getMedications",
            {
              headers: this.headers 
            }
         )
         .then((resp)=>{
             return resp.json();
         })
          
         return medicals; 
     } 
      async addMedicals(){
         
     }
}