import express from "express"; 
import MedicationsDao  from "../../dao/MedicationsDao.js";

const medRouter =  express.Router(); 
const medDao = new MedicationsDao(); 
medRouter.get('/getMedications',async(req,res)=>{ 
  try{ 
     var meds = null; 
     const{appointment_id} = req.query; 
     const user_id = req.user_id; 
     if(appointment_id){
        meds = await medDao.getMedicationsFromAppointment(appointment_id); 
     } 
     else{
        meds = await medDao.getMedicationsFromPatient(user_id);
     }
   
     return res.send(meds); 
  } 
  catch(err){
     return res.status(400).send(err.message);  
  }
}) 

medRouter.post("/addMedication",async(req,res)=>{
  try{
     const {appointment_id,prescription,medication_name,frequency,duration_days} = req.body;
     const result = await medDao.addMedication(appointment_id,req.user_id,
        {
            prescription,
            medication_name,
            frequency, 
            duration_days
        }
     )
     if(result.affectedRows > 0){ 
         return res.send({status:"Success",insertId: result.insertId}); 
     }
     return res.send({status:"Failure",message:"Error in adding"}); 
  } 
  catch(err){
      return res.status(400).send({status:"Failure",message:err.message})
  }
})

medRouter.post("/updateMedication",async(req,res)=>{
     try{  
         const {medicationId,fields} = req.body;   
         //expect fields to be an object containing updated data
         const result = await updateMedicationDetails(medicationId, fields); 
         if(result.affectedRows > 0){ 
               return res.send({status:"Success"}); 
         } 
         return res.send({status:"Failure",message:"No changes detected"}); 
         
     }
     catch(err){
         return res.status(400).send({status:"Failure",message:err}); 
     }
})

medRouter.post("/deleteMedication/:medicationId",async(req,res)=>{
     try{
          const {medicationId} = req.params; 
          const result = await deleteMedication(medicationId); 
          if(result.affectedRows > 0){
             return res.send({status:"Success"})
          }
     }
     catch(err){
        return res.status(400).send({status:"Failure",message:err.message})
     }
})
export default medRouter;