import express from 'express'; 
import HealthRecordDao from '../../dao/HealthRecordDAO.js'; 

const hrDao = new HealthRecordDao(); 

const hrRouter = express.Router(); 

hrRouter.get("/getHealthRecord",async function(req,res){
    const patientId = req.user_id; 
    const healthRecord =  await hrDao.getHealthRecordofPatient(patientId); 
    res.send(healthRecord); 
})

hrRouter.post("/addRecord",async function(req,res){ 
   const { blood_type, diagnosis, notes, height, weight} = req.body;  
   const PatientId = req.user_id
   const result =  await hrDao.addHealthRecord(PatientId,
     {
        blood_type,diagnosis,notes,height,weight
     }
   ) 
   if(result.affectedRows > 0){ 
      return res.send({status:'Success'}); 
   }

   return res.send({status:"Failure"}); 

}) 

hrRouter.post("/updateRecord",async function(req,res){
   
    const tuples = Object.entries(req.body);  
    var result = null; 

    if(tuples.length == 1){
         const [field,value] = tuples[0]; 
         result= await hrDao.updateHealthRecord(field,value,req.user_id);  
    }
    else{ 
         result = await hrDao.updateHealthRecordBulk(req.body,req.user_id)
    }

    if(result == "Invalid field"){
         return res.status(400).send({status:"Failure",message:"Invalid field provided"})
    }
    if(!result.affectedRows){
        return res.send({status:"Failure",message:"Record may have already been updated."})
    }  

    return res.send({status:"Success"})

}) 

hrRouter.post("/deleteRecord",async function(req,res){
  const result = await hrDao.deleteHealthRecord(req.user_id); 
  if(!result.affectedRows){
     return res.send({status:"Failure",message:"Record may have already been deleted or does not exist"}); 
  }
  return res.send({status:"Success"}); 
})

export default hrRouter;