class ClinicController{
  constructor(headers){
    this.headers = headers;
  }
     async getClinicsByService(service_id){
        const params = new URLSearchParams({
            option: 'ByService',
            service: service_id
          });
          
          const response = await fetch(`/api/clinic/getClinic?${params.toString()}`,
           {
             headers: this.headers
           }
        );
          const clinics = await response.json();
          
          return clinics;
     }
}

export default ClinicController;