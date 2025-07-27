import express from 'express';  
import ServiceDao from '../../dao/ServiceDao.js';
import ClinicDao from '../../dao/ClinicDao.js';
const clinicRouter = express.Router();   
const clinicDao = new ClinicDao(); 
const serviceDao = new ServiceDao(); 
clinicRouter.get("/getClinic",async function(req,res){
  const option = req.query.option;  
  const service_id = req.query.service ?? null; 
  console.log(option,service_id); 
  if(option == 'ByService'){  
     const clinics =  await clinicDao.listClinicByService(service_id);   
     res.send(clinics); 
  }   
  
  if(option == null){
    res.status(400).send({status:"failure",message:"Option not specified"}); 
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