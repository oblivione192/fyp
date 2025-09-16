import express from 'express';  
import fetch from 'node-fetch'; 
import RideDAO from '../../dao/RideDAO.js';  
import ClinicDao from '../../dao/ClinicDao.js'; 

import generatePossibleScheduleList from '../../rideRecommendUtils/index.js';
const MVARouter = express.Router();  
const rideDao = new RideDAO();  
const clinicDao =  new ClinicDao(); 
async function resolveClinicCoordinates(clinicCoordinates, destinationClinicId) {
  if (clinicCoordinates) return clinicCoordinates;
  if (!destinationClinicId) throw new Error("Either clinicCoordinates or destinationClinicId is required");

  const result = await clinicDao.getClinicById(destinationClinicId);
  if (!result || result.length === 0) throw new Error("Clinic not found");

  return {
    latitude: result[0].latitude,
    longitude: result[0].longitude,
  };
} 


MVARouter.get('/staff/getStaff/:staff_id',(req,res)=>{ 

})   

MVARouter.post('/staff/addStaff',(req,res)=>{ 

}) 

MVARouter.get('/schedules/getSchedulesForStaff',(req,res)=>{ 

}) 

MVARouter.post('/ride/bookRide',async(req,res)=>{   
  const {
         user_id, 
         staff_vehicle_id, 
         ride_timestamp,
         destination_clinic_id
        } = req.body    
  try{ 
      const result = await rideDao.bookRide(user_id, staff_vehicle_id, ride_timestamp, destination_clinic_id);
      if(result.status == "OK"){ 
           return res.status(200).send(result); 
      } 
  }
  catch(err){
      return res.status(500).send({message:err.message}); 
  }
 
   
}) 
MVARouter.get('/ride/getRides', async (req, res) => {
  try {
    const { user_id, dateStart, dateEnd, staffId, option, withStaffDetails, withUserDetails, withClinicDetails } = req.query;

    const params = {};
    const returnFields = {
      Rides: [],
      Staff: [],
      User: [],
      Clinic: []
    };

    // Handle option types
    if (option === "ByStaff") {
      if (!staffId) {
        return res.status(400).send({ error: "Staff id not specified" });
      }
      params.staff_id = staffId;
    }

    if (option === "ByUser") {
      params.user_id = user_id ? user_id : req.user_id;
    }

    // Add date range filter
    if (dateStart && dateEnd) {
      params.date_range = { start: dateStart, end: dateEnd };
    }

    // Handle return fields
    if (withStaffDetails === "true") {
      returnFields.Staff.push("staff_id", "f_name", "l_name", "registration_date");
    }

    if (withUserDetails === "true") {
      returnFields.User.push("user_id", "preferredLanguage", "wheelchairNeeded", "joinDate", "birthDate", "gender");
    }

    if (withClinicDetails === "true") {
      returnFields.Clinic.push("ClinicId", "name", "registration_no", "address");
    }

    if (returnFields.Rides.length === 0) {
      returnFields.Rides.push("ride_id", "ride_timestamp", "destination_clinic_id", "staff_id", "user_id");
    }

    const rides = await rideDao.getRides(params, returnFields);
    return res.json(rides);
  } catch (err) {
    console.error("Error in /ride/getRides:", err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
}); 

MVARouter.put('/ride/updateRide',(req,res)=>{ 

})  
MVARouter.post('/ride/recommendRides',async(req,res)=>{ 
   let {
    appointment_start_time,
    appointment_end_time,
    userCoordinates, 
    destinationClinicId, 
    clinicCoordinates,
    requiresWheelchair,
    preferredLanguage, 
    top_k,
    options 
   } =  req.body;  
  

  try{ 

   if(clinicCoordinates == null){ 
         clinicCoordinates = await resolveClinicCoordinates(clinicCoordinates,destinationClinicId); 
   }  
   
  } 
  catch(err){ 
     return res.status(400).send({message:err.message});  
  }

  //options include return all schedules while putting top_k schedules in a dedicated array
  //also include ascending or descending  
  //options include pagination. return the next page of schedules. each page has top_k ride schedules ranked accordingly
   const possible_schedules = await generatePossibleScheduleList(
      appointment_start_time,
      appointment_end_time,
      userCoordinates, 
      clinicCoordinates, 
      requiresWheelchair,
      preferredLanguage 
   )  
   
   if(!possible_schedules.length) return res.send({message:"No feasible schedules",recommended_schedules: []}); 
   console.log(possible_schedules); 

   try{
    const response = await fetch(`http://${process.env.ML_SERVICE_BASE_URL}/recommend`,
     {
        method: "POST", 
        headers: {"Content-Type": "application/json"}, 
        body:JSON.stringify({
             schedules: possible_schedules, 
             top_n : top_k
        }) 
     }
   )
   
   
   if (!response.ok) {
      console.error("HTTP error:", response.status);
      return res.status(response.status).send({message:"Something went wrong"})
    }
    
    const result = await response.json(); 
    
    //TODO: consider the options and send the data accordingly 

    return res.send({recommended_schedules:result, status:"OK"});  
   }
   catch(err){
       console.error(err) 
       return res.status(500).send({message:"Internal server error"}); 
   }
}) 

export default MVARouter; 