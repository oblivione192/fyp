import express from 'express'; 
import ClinicDao from '../../dao/ClinicDao.js';
const clinicRouter = express.Router();   
const clinicDao = new ClinicDao(); 

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

export default clinicRouter;