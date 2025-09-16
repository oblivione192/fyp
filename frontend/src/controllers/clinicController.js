class ClinicController{
  constructor(headers){
    this.headers = headers;
  }
     async getClinicsByService(service_id,options={}){ 
        //options include lat, lng and withPhoto
        const params = new URLSearchParams({
            option: 'ByService',
            service: service_id,
            ...options
          }); 
          
          const response = await fetch(`/api/clinic/getClinic?${params.toString()}`,
           {
             headers: this.headers
           }
        );
          const clinics = await response.json();
          
          return clinics;
     }
     async getClinicEnrollments(clinic_id){
         const params = new URLSearchParams({ 
           clinicId: clinic_id
         }) 
         const response  = await fetch(`/api/clinic/getClinicEnrollments?${params.toString()}`,
        {
          headers: this.headers 
        }
      ) 
       const enrollments = await response.json(); 
       return enrollments; 
     }
}

export default ClinicController;