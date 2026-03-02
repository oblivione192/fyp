import express from 'express';  
import ServiceDao from '../../dao/ServiceDao.js';
import ClinicDao from '../../dao/ClinicDao.js';    
import distance from '../../rideRecommendUtils/distance.js';
import fetch from 'node-fetch';
const clinicRouter = express.Router();   
const clinicDao = new ClinicDao(); 
const serviceDao = new ServiceDao();   

clinicRouter.get("/getClinic", async function (req, res) {
  const lat = req.query.lat;
  const lng = req.query.lng;
  const withPhoto = req.query.withPhoto ?? false;
  const option = req.query.option;
  const service_id = req.query.service ?? null;
  const clinics = await clinicDao.listClinicByService(service_id); 
  if (option === "ByService") {
    

    if(process.env.NODE_ENV == "production"){  
        try{
          const clinicsWithDistance = await Promise.all(clinics.map(async (clinic) => {        
               const calculatedDistance = await distance(lat, lng, clinic.latitude, clinic.longitude);
               return {...clinic, distance: calculatedDistance}
          })); 
        
          const filteredClinics = clinicsWithDistance.filter((clinic) => clinic.distance < 20000);

          return res.send(filteredClinics); 

        }  
        catch(err){    

           return res.status(500).send({status:"Failure",message:err.message})  
            
        }
       
    } 
    else{  
        return res.send(clinics); 
    }
  }

  if (!option) {
    return res
      .status(400)
      .send({ status: "failure", message: "Option not specified" });
  }
}); 

clinicRouter.get("/getClinicEnrollments",async function(req,res){
    const clinicId =  req.clinicId; 
    try{
        const enrollments = await clinicDao.getClinicEnrollmentsByClinicId(clinicId); 
        return res.send(enrollments); 
    } 
    catch(err){
       return res.status(400).send({status:"Failure",message:err.message})
    }
}) 

clinicRouter.get("/getClinicServices",async function(req,res){
   //request expects a clinic id. 
   //if clinicId is not provided then get the services by the requester's identity (clinic id)
   const clinicId = req.query.clinicId || req.clinicId;   
   try{
      const services = await serviceDao.listServicesByClinic(clinicId);  
      return res.send(services); 
   }
   catch(err){
      return res.status(400).send({status:"Failure",message:err.message})
   }
}) 

export default clinicRouter;