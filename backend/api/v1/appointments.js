import express from 'express';
import AppointmentDao from '../../dao/AppointmentDao.js';
import SlotDao from '../../dao/SlotDAO.js';
import ServiceDao from '../../dao/ServiceDao.js'; 
import Event from '../../events/eventBus.js';

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
appointmentRouter.put("/mockConfirmAppointment",async function(req,res){
    console.log("Hello you have confirmed an appointment.") 
    Event.emit("notifyUser",{
        user_id: req.user_id, 
        title: "Your appointment has been confirmed!", 
        body:"Your appointment will be today at 4 pm. Don't miss it ya!"
    })
    return res.send({message:"Ok"})
})
appointmentRouter.post("/addClinicSlot",async function(req,res){
   const clinicId = req.clinicId; 
   const {slotDate,startTime,endTime} = req.body;  
   try{
    const result = await slotDao.addClinicSlot(clinicId,
      {
        slotDate,
        startTime,
        endTime
      }
    ) 
    if(result.status == 1){
      return res.send({status:"Success",
        addedSlot: {
           slotId: result.slotId, 
           timestamp : new Date()
        }
      })
    }  
    return res.send({status:"Failure",message:"Nothing added"}); 
    } 
    catch(err){
       return res.status(400).send({status:"Failure",message:err.message}); 
    }
   
}) 

// Confirm an appointment
appointmentRouter.put("/confirmAppointment", async (req, res) => {
  const { AppointmentId } = req.body;
  try {
    const result = await appDao.confirmAppointment(AppointmentId); 
    if (result) {  
      const appointments = await appDao.getAppointmentById(AppointmentId); 
      const user_id_of_appointment =  appointments[0].user_id;  

      Event.emit('notifyUser',{ 
          user_id: user_id_of_appointment,
          title: "Appointment has been confirmed", 
          body: ` 
            Your appointment on ${new Date(appointments[0].slotDate).toLocaleDateString()} has been approved
           `
      }) 

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
  const PatientId = req.user_id; 
  if (!date || !startTime || !endTime || !SlotId ) {
    return res.status(400).send({ status: "Failure", message: "Missing required fields" });
  }

  try {
    const clash = await appDao.utilCheckAppointmentClash(PatientId,SlotId,startTime,endTime); 
    if (clash) {
      return res.status(409).send({ status: "Failure", message: "Appointment time clashes with existing booking" });
    } 

    

     
    console.log(PatientId);  
  
    const result = await appDao.createAppointment(SlotId, DoctorId, PatientId, {
      date,
      visit_purpose,
      startTime,
      endTime 
    }); 
    //now you have to implement the system to account for appointment limits. 
    //Use the estimated duration in minutes for each clinic service. Serves as the best estimate. 
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
    const result = await appDao.updateAppointmentBulk(
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
   catch(err){ 
    console.log(err.message); 
    return res.status(500).send({status:"Failure",message:err.message}); 
   }
})
appointmentRouter.post('/updateAppointment',async(req,res)=>{
    const {AppointmentId,field,newValue} = req.body; 
    try{
       const result = await appDao.updateAppointment(AppointmentId,field,newValue); 
      if(result){
        return res.send({status:"success"})
      }
      return res.send({status:"failure",message:"Non existent apppintment or appointment already updated"}); 
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
    const result = await slotDao.openClinicSlot(clinic_id, slot_id);
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
  const { option} = req.query;
  const clinicId = req.clinicId  || req.query.clinicId 
  var slots = []
  console.log(req.clinicId); 
  if (!option) {
    return res.status(400).send({ status: "Failure", message: "clinicId and option are required" });
  }
  try{
    if(option == "Upcoming"){  
       slots = await slotDao.listClinicUpcomingSlots(clinicId); 
    }
    if(option == "ByDate"){ 
       slots = await slotDao.listClinicSlotsByDate(req.query.date,clinicId); 
    }  
    else if(!option){
       slots = await slotDao.listClinicSlots(clinicId); 
    }
  } 
  catch(err){
      return res.status(500).send({status: "Failure", message: "Internal server error"}); 
  }

   return res.send(slots); 
});    

appointmentRouter.delete("/deleteSlot/:slotId", async (req, res) => {
  try{
    const {slotId} = req.params; 
    const status = await slotDao.deleteSlot(slotId); 
    if(status){
      return res.send({status:"success"}) 
    }
    return res.send({status:"failure",message:"Slot may have already been deleted"}); 
  }
  catch(err){
     return res.send({status:"failure",message:err.message}); 
  }
}) 

appointmentRouter.post("/changeSlotTime",async(req,res)=>{
   const { slotId,slotDate, newStartTime,newEndTime} = req.body;  
   const clinicId = req.clinicId || req.body.clinicId
   try{ 
      const isSlotClash = await slotDao.checkIfSlotClashes(clinicId,slotDate,newStartTime,newEndTime); 
      if(isSlotClash){ 
         return new Error("Slots have clashed. Please check your list of slots.")
      }
      const status= await slotDao.updateSlot(slotId,
        {
          startTime: newStartTime,
          endTime: newEndTime
        } 
      ) 
      if(status){
        return res.send({status:"success"}); 
      }
      else{
        return res.send({status:"Failure",message:"Same value has been updated."}); 
      }
      
   } 
   catch(err){
      return res.status(500).send({status:"Failure",message:err.message}); 
   }
}) 

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
appointmentRouter.get("/count", async (req, res) => {
  const { option, UserId, ClinicId } = req.query;

  const user_id = UserId || req.user_id;
  const clinic_id = ClinicId || req.clinicId;

  let result;

  try {
    if (option === 'ByUser') {
      if (!user_id) {
        return res.status(400).send("User ID is missing");
      }
      result = await appDao.getUserAppointmentCount(user_id);
    } else if (option === 'ByClinic') {
      if (!clinic_id) {
        return res.status(400).send("Clinic ID is missing");
      }
      result = await appDao.getClinicAppointmentCount(clinic_id);
    } else {
      return res.status(400).send("Invalid option specified");
    }

    return res
      .header('Content-Type', 'text/plain')
      .send(result.toString());
  } catch (err) {
    console.error("Error fetching appointment count:", err);
    return res.status(500).send("Internal server error");
  }
});
// Get appointments by various filters
appointmentRouter.get("/getAppointment", async (req, res) => {
  const {
    option,
    date,
    clinicId: queryClinicId,
    SlotId,
    AppointmentId,
    page,
    user_id: queryUserId,
  } = req.query;

  console.log(req.query);

  try {
    if (!option) {
      return res.status(400).send({
        status: "Failure",
        message: "No option specified",
      });
    }

    let user_id = queryUserId || req.user_id;
    let clinicId = queryClinicId || req.clinicId;
    let appointments = null;

    
   
   
    switch (option) {
      case "ByUser":
        if (!user_id) {
          return res.status(400).send({
            status: "Failure",
            message: "User ID is required for ByUser option",
          });
        }

        const userCount = await appDao.getUserAppointmentCount(user_id);
        const totalPages = Math.ceil(userCount / 5);

        if (page > 0 && page <= totalPages) {
          appointments = await appDao.getUserAppointments(user_id, page, 5);
          return res.send(appointments);
        } else {
          return res.status(400).send({
            status: "Failure",
            message: "Page exceeded",
          });
        }

      case "ByClinic": 
       if(!clinicId){
              return res.status(400).send({
                status:"Failure", 
                message: "Clinic Id is required for ByClinic option"
              }) 
        } 
        const appCount = await appDao.getClinicAppointmentCount(clinicId);  
        let Pages = Math.ceil(appCount / 5); 
        if(page > 0 && page <= Pages){
          appointments = await appDao.getClinicAppointments(user_id,page,5); 
          return res.send(appointments); 
        } 
        else{
          return res.status(400).send({
            status:"Failure",
            message:"Page exceeded"
          })
        }



      case "ByDate":
        if (!date) {
          return res.status(400).send({
            status: "Failure",
            message: "Date is required",
          });
        }

        appointments = await appDao.listClinicAppointmentsByDate(date,clinicId)
        return res.send(appointments);

      case "ByClinicSlots":
        if (!SlotId || !clinicId) {
          return res.status(400).send({
            status: "Failure",
            message: "SlotId and clinicId are required",
          });
        }

        appointments = await appDao.listAppointmentsbyClinicSlot(SlotId, clinicId);
        return res.send(appointments);

      case "ById":
        if (!AppointmentId) {
          return res.status(400).send({
            status: "Failure",
            message: "AppointmentId is required",
          });
        }

        appointments = await appDao.getAppointmentById(AppointmentId);
        return res.send(appointments);

      case "ByClinicDate":
        if (!clinicId || !date) {
          return res.status(400).send({
            status: "Failure",
            message: "clinicId and date are required",
          });
        }

        appointments = await appDao.listClinicAppointmentsByDate(date, clinicId);
        return res.send(appointments);

      default:
        return res.status(400).send({
          status: "Failure",
          message: "Invalid option",
        });
    }
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return res.status(500).send({
      status: "Failure",
      message: "Internal server error",
    });
  }
});


export default appointmentRouter;
