import express from 'express';  
import ServiceDao from '../../dao/ServiceDao.js';
import ClinicDao from '../../dao/ClinicDao.js'; 
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
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=3000&type=health&keyword=clinic&key=${process.env.GOOGLE_MAP_API_KEY}`;

            const response = await fetch(url);
            const data = await response.json();
            try{
              if (data.status === "OK") { 
                // Enrich DB clinics with Google photo reference
                const enrichedClinics = clinics.map((clinic) => {
                  const match = data.results.find(
                    (place) => place.name.toLowerCase() === clinic.name.toLowerCase()
                  );
                  console.log(match.photos); 
                  if (match && match.photos && match.photos.length > 0 && withPhoto) {
                    clinic.photo_reference = match.photos[0].photo_reference; 
                    console.log("Photo reference found for clinic ", clinic.name, clinic.photo_reference);

                    // Optionally also build a direct photo URL
                    clinic.photo_url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${match.photos[0].photo_reference}&key=${process.env.GOOGLE_MAP_API_KEY}`;
                  }

                  return clinic;
                });

                return res.send(enrichedClinics);
              }

              return res.status(500).send({ status: "failure", message: data.status }); 
          }  
          catch(err){
              return res.status(500).send({message:"Failed to get clinics."}); 
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