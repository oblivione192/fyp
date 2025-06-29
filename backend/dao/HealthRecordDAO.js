import db from '../db/mysql.js'; 
import checkFieldExists from './checkFieldExists.js';
import buildUpdateQuery from './buildUpdateQuery.js';
class HealthRecordDao{
    constructor(){
        this.db = db;
    }
    async getHealthRecordofPatient(patient_id){
        const query=
         `SELECT h.* FROM HEALTHRECORD  h
          JOIN User u  ON h.PatientId = u.user_id 
          WHERE h.PatientId = ?           
        `; 

        return this.executeQuery(query,[patient_id]);
    } 
    async updateHealthRecord(field,newValue,patientId){
        const fieldExists = await checkFieldExists("HEALTHRECORD",field)
        if(fieldExists){ 
             const query =  
             ` 
              UPDATE HEALTHRECORD  
              SET ${field} = ? 
              WHERE patientId = ?
             `
             return this.executeQuery(query,[newValue,patientId]) 
             
             ;  
        }
        return "Invalid field"; 
    }
   async updateHealthRecordBulk(fields, patientId) {
           const { query, values } = await buildUpdateQuery(
                "HEALTHRECORD",       // Table name
                fields,               // Fields to update
                "RecordId",           // ID column name
                patientId,            // ID value
                checkFieldExists      // Field validation function
            );

           return this.executeQuery(query, values);

    } 


    async addHealthRecord(patient_id,data={}){ 
        const {blood_type,diagnosis,notes,height,weight} = data; 
        const query = 
        `
        INSERT INTO HEALTHRECORD
        (PatientId, blood_type, diagnosis, notes, height, weight)  
        VALUES
        (?, ?, ?, ?, ?, ?)
        
        `
        return this.executeQuery(query,[patient_id,blood_type,diagnosis,notes,height,weight]) 
       
    } 
    async deleteHealthRecord(patient_id){
         const query =
         `
         DELETE FROM HEALTHRECORD 
         WHERE HEALTHRECORD.PatientId = ? 
         ` 

         return this.executeQuery(query,[patient_id]) 
       
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

export default HealthRecordDao; 