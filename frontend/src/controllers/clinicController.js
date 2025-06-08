class ClinicController{
    static async getClinicsByService(service_id){
        const params = new URLSearchParams({
            option: 'ByService',
            service: service_id
          });
          
          const response = await fetch(`/api/clinic/getClinic?${params.toString()}`,
           {
             headers:{
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
             }
           }
        );
          const clinics = await response.json();
          
          return clinics;
     }
}

export default ClinicController;