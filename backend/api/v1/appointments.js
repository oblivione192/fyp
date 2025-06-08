import express from 'express';
import AppointmentDao from '../../dao/AppointmentDao.js';
import SlotDao from '../../dao/SlotDAO.js';
import ServiceDao from '../../dao/ServiceDao.js';

const appointmentRouter = express.Router();
const appDao = new AppointmentDao();
const slotDao = new SlotDao();
const serviceDao = new ServiceDao();

// Utility: Check if two time intervals overlap
function isTimeOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

// Utility: Check for slot clashes
async function checkSlotClashes(date, newStartTime, newEndTime, clinicId) {
  const slots = await slotDao.listClinicSlotsByDate(date, clinicId);
  return slots.some(slot => isTimeOverlap(newStartTime, newEndTime, slot.startTime, slot.endTime));
}

// Utility: Check for appointment clashes
async function checkAppointmentClashes(date, newStartTime, newEndTime, slotId, clinicId) {

  const appointments = await appDao.listAppointmentsByClinicSlot(slotId, clinicId);
  return appointments.some(app =>
    app.date === date && isTimeOverlap(newStartTime, newEndTime, app.startTime, app.endTime)
  );
}

// Confirm an appointment
appointmentRouter.put("/confirmAppointment", async (req, res) => {
  const { app_id } = req.body;
  try {
    const result = await appDao.confirmAppointment(app_id);
    if (result) {
      return res.send({ status: "Success" });
    } else {
      return res.status(400).send({ status: "Failure", message: "Unable to confirm appointment" });
    }
  } catch (err) {
    return res.status(500).send({ status: "Failure", message: "Internal server error" });
  }
});

// Add a new appointment
appointmentRouter.post("/addAppointment", async (req, res) => {
  const { date, visit_purpose, startTime, endTime, SlotId, ClinicId, DoctorId } = req.body;  
  console.log(date); 
  if (!date || !startTime || !endTime || !SlotId ) {
    return res.status(400).send({ status: "Failure", message: "Missing required fields" });
  }

  try {
    const clash = await checkAppointmentClashes(date, startTime, endTime, SlotId, ClinicId);
    if (clash) {
      return res.status(409).send({ status: "Failure", message: "Appointment time clashes with existing booking" });
    } 

    const PatientId = req.user_id; 

     
    console.log(PatientId); 
    const result = await appDao.createAppointment(SlotId, DoctorId, PatientId, {
      date,
      visit_purpose,
      startTime,
      endTime
    }); 

    const addedAppointment = await appDao.getLatestAppointmentFromUser(req.user_id);  
    addedAppointment.createdAt = Date.now();   

    if (result) {
      return res.send({ status: "Success", newAppointment: addedAppointment });
    } else {
      return res.status(500).send({ status: "Failure", message: "Failed to add appointment" });
    }
  } catch (err) {
    console.error("Error adding appointment:", err);
    return res.status(500).send({ status: "Failure", message: "Internal server error" });
  }
}); 
appointmentRouter.post("/postponeAppointment",async(req,res)=>{
   const {AppointmentId,SlotId,newStartTime,newEndTime} = req.body;    
   console.log(req.body); 
   const appointmentClashes = await appDao.utilCheckAppointmentClash(req.user_id,SlotId,newStartTime,newEndTime); 
   if(appointmentClashes)return res.send({status:"Failure",message:"Appointment clashed with another"});  
   console.log("Executing here"); 
   try{
    const result = await appDao.updateAppointment(
      AppointmentId,{
        SlotId: SlotId,
        startTime: newStartTime,
        endTime: newEndTime,
      }
    ) 
    if(result){return res.send({status:"Success",
      updatedData:
      {
         ...req.body
      }
    })} 
    return res.status(400).send({status:"Failure",message:"Error in updating. One or more invalid fields"}); 
   } 
   catch{
    return res.status(500).send({status:"Failure",message:"Internal server error"}); 
   }
})
appointmentRouter.post('/updateAppointment',async(req,res)=>{
    const {AppointmentId,field,newValue} = req.body; 
    try{
       const result = await appDao.updateAppointment(AppointmentId,field,newValue); 
      if(result){
        return res.send({status:"success"})
      }
      return res.status(400).send({message:"Non existent apppintment or appointment already updated"}); 
    }
    catch{
      return res.status(500).send({message:"Internal server error"}); 
    }
})
appointmentRouter.post("/deleteAppointment",async(req,res)=>{
   const result = await appDao.deleteAppointment(req.body.AppointmentId);  
   if(result){
        return res.send({status:'Success',deletedId:req.body.AppointmentId})
   } 
   return res.status(500).send({status:'failure',message:'Internal server error'}); 
})
// Get services
appointmentRouter.get("/getServices", async (req, res) => { 
  try {
    const services = await serviceDao.listAllServices(); 
    return res.send(services);
  } catch (err) {
    return res.status(500).send({ status: "Failure", message: "Internal server error" });
  }
});

// Open a slot
appointmentRouter.put("/openSlot", async (req, res) => {
  const { slot_id, clinic_id } = req.body;
  try {
    const result = await openClinicSlot(clinic_id, slot_id);
    if (result) {
      return res.send({ status: "Success" });
    }
    return res.status(500).send({ status: "Failure", message: "Could not open slot" });
  } catch (err) {
    return res.status(500).send({ status: "Failure", message: "Internal server error" });
  }
});

// Get available slots by date and clinic
appointmentRouter.get("/getSlots", async (req, res) => {
  const { clinicId, option} = req.query;
  
  if (!clinicId || !option) {
    return res.status(400).send({ status: "Failure", message: "clinicId and option are required" });
  }
  try{
    if(option == "Upcoming"){  
        const slots = await slotDao.listClinicUpcomingSlots(clinicId); 
        return res.send(slots); 
    }  
  } 
  catch(err){
    return res.status(500).send({status: "Failure", message: "Internal server error"}); 
  }
  try {
    const slots = await slotDao.listClinicSlotsByDate(date, clinicId);
    return res.send(slots);
  } catch (err) {
    return res.status(500).send({ status: "Failure", message: "Internal server error" });
  }
});  
appointmentRouter.get("/confirmedAppointments",async(req,res)=>{
   const {user_id,page} = req.query; 
   try{
    const appointments = await appDao.getUserUpcomingAppointments(req.user_id,page,5); 
    return res.send(appointments); 
   }
   catch{
    return res.status(500).send({message:"Internal server error"}); 
   }
})
appointmentRouter.get("/pendingAppointments",async(req,res)=>{
   const {user_id,page} = req.query; 
   try{
    const appointments =  await appDao.getUserPendingAppointments(req.user_id,page,5); 
    return res.send(appointments);
   }
   catch{ 
     console.error();
     return res.status(500).send({message:"Internal server error"}); 
   }
})
appointmentRouter.get("/appointmentHistory",async(req,res)=>{
  const {user_id,page} = req.query;  
  if(!page) {page = 1}
  try{
    const appointments = await appDao.getUserAppointmentHistory(user_id,page,5); 
    return res.send(appointments);  
  }
  catch{
    return res.status(500).send({message:"Internal server error"}); 
  }
})
appointmentRouter.get("/appointmentUpcomingAppoinments",async(req,res)=>{
  const {user_id, page} = req.query; 
  if(!page) {page = 1} 
  try{
    const appointments = await appDao.getUserUpcomingAppointments(req.user_id,page,5); 
    return res.send(appointments); 
  } 
  catch{
    return res.status(500).send({message:"Internal server error"}); 
  }
})
appointmentRouter.get("/count",async(req,res)=>{
   const result = await appDao.getUserAppointmentCount(req.user_id); 
  
   return res
   .header('Content-Type','text/plain')
   .send(result); 
})
// Get appointments by various filters
appointmentRouter.get("/getAppointment", async (req, res) => {
  const { option, date, clinicId, SlotId, AppointmentId, page, user_id} = req.query;
  console.log(req.query)
  try {
    if (!option) {
      return res.status(400).send({ status: "Failure", message: "No option specified" });
    }

    let appointments = null;
    switch (option) { 
      case 'ByUser':   
        const userCount = await appDao.getUserAppointmentCount(req.user_id); 
        const totalPages = Math.ceil(userCount / 5);
        console.log(totalPages); 
        if (page > 0 && page <= totalPages) {
            appointments = await appDao.getUserAppointments(req.user_id, page, 5); 
            return res.send(appointments);  
        } 
        return res.status(400).send({ status: "failure", message: "Page exceeded" });



      case 'ByClinicSlots':
        if (!SlotId || !clinicId) {
          return res.status(400).send({ status: "Failure", message: "SlotId and clinicId are required" });
        }
        appointments = await appDao.listAppointmentsbyClinicSlot(SlotId, clinicId);
        break; 



      case 'ById':
        if (!AppointmentId) {
          return res.status(400).send({ status: "Failure", message: "AppointmentId is required" });
        }
        appointments = await appDao.getAppointmentById(AppointmentId);
        break; 



      case 'ByDate':
        if (!date) {
          return res.status(400).send({ status: "Failure", message: "Date is required" });
        }
        appointments = await appDao.listAppointmentsbyDate(date);
        break; 



      default:
        return res.status(400).send({ status: "Failure", message: "Invalid option" });
    }

    return res.send(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return res.status(500).send({ status: "Failure", message: "Internal server error" });
  }
});

export default appointmentRouter;
