import express from 'express'; 
import ProfileDao from '../../dao/ProfileDao.js';

const profileDao = new ProfileDao(); 

const profileRouter = express.Router(); 

profileRouter.get("/getProfile",async function(req,res){
    const {userType} = req.query;   
    try{
        const profileDetails =  await profileDao.getProfile(userType,req.user_id);  
        return res.send(profileDetails[0]); 
    }
    catch(err){
        return res.status(400).send({status:"Failure",message:err.message})
    }
})

profileRouter.post("/updateProfile", async function(req,res){
      const fields =  req.body;   
      try{
         const result = await profileDao.updateProfileBulk(req.body.userType,fields,req.user_id);
         if(result.affectedRows > 0){ 
            return res.send({status: "Success"}); 
         } 
         return res.send({status:"Failure",message:"No changes"}); 
      } 
      catch(err){ 
         return res.status(400).send({status:"Failure",message:err.message}); 
      }
      
})

export default profileRouter;
