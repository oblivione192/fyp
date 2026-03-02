import express from 'express'; 
import UserDao from '../../dao/UserDao.js';
import jwt from 'jsonwebtoken';
import ClinicDao from '../../dao/ClinicDao.js';

const adminRouter = express.Router(); 

const adminDao = UserDao.getAdminDao(); 

adminRouter.post("/register",async(req,res)=>{ 

    try{
      const clinicNo =  req.body?.clinicNo; 
      const username = req.body?.username; 
      const password = req.body?.password;  
      
      const result =  await adminDao.createUser(username.trim(),clinicNo.trim(),password.trim()); 
  
     return res.send({status:"Success"}); 
    
    } 
    catch(err){
          return res.send({status:"Failure",message:err.message}); 
    } 
}); 

adminRouter.post("/login",async(req,res)=>{
     try{    
        var message = ""; 
         const  {clinicNo,username,password} = req.body; 
         const statusCode= await adminDao.validateCredentials(
          clinicNo.trim(),username.trim(),password); 
        
         switch(statusCode){ 
             case 0 : 
               message = "User does not exist" 
               break;
             case 1: 
               message = "Wrong password"  
               break;
             default:  
                const user_id = await adminDao.getUserIdByUsernameAndClinic(username,clinicNo);   
                let clinicDao = new ClinicDao(); 
                let clinic = await clinicDao.getClinicByRegNo(clinicNo); 
                const token = jwt.sign({user_id:{user_id:user_id.AdminId},username:username,clinicId:clinic[0].ClinicId},process.env.COOKIE_SECRET,
                    {
                        expiresIn: 3600,
                    }
                ); 
  
                return res.send({success:true,token:token})
         } 
         
         return res.send({status:"Failure",message:message}); 
        
     }
     catch(err){
        return res.send({status:"Failure",message:err.message})
     }
});  



export default adminRouter; 
