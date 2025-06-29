import checkFieldExists from "./checkFieldExists.js";  
import buildUpdateQuery from "./buildUpdateQuery.js";
import db from "../db/mysql.js";
class MedicationsDao{  
    constructor(){
        this.db = db; 
    }
    async getMedicationsFromPatient(patient_id){
     const query = 
     `
     SELECT m.* FROM Medication m
     JOIN USER u on m.PatientId =  u.user_id 
     WHERE m.PatientId = ? 
     ` 

     return this.executeQuery(query,[patient_id]); 
    }  

    async getMedicationsFromAppointment(appointment_id){ 
     const query = 
     `
       SELECT m.* FROM Medication m
       JOIN Appointment a ON  m.AppointmentId = a.AppointmentId 
       WHERE m.AppointmentId = ? 
     `
     return this.executeQuery(query,[appointment_id])
    }   

    async addMedication(appointment_id,user_id,data){ 
      //data should contain prescription, medication_name, frequency, duration_days
        const query = 
        `
         INSERT INTO MEDICATION 
         VALUES
          (AppointmentId, PatientId, prescription, medication_name, frequency, duration_days)
          (?,?,?,?,?,?)
        ` 

        return this.executeQuery(query,[appointment_id,user_id,...data])
    }
    async updateMedicationDetails(medicationId, fields){
           try{
             const {query,params} = await buildUpdateQuery(
              "Medication",fields,"MedicationId",medicationId,checkFieldExists
            );  
             return this.executeQuery(query,params);
           }  
           catch(err){
              throw new Error(err.message); 
           }       
    }

    async deleteMedication(medicationId){
            const query = 
            `
            DELETE FROM MEDICATION
            WHERE MedicationId = ? 
            ` 

            return this.executeQuery(query,[medicationId]); 

    }  

    executeQuery(query, params = []) {
    return new Promise((resolve, reject) => { 
      this.db.query(query, params, function(err, results){  
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
} 

export default MedicationsDao; 