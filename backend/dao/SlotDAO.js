import db from "../db/mysql.js";
import buildUpdateQuery from './buildUpdateQuery.js' 
import checkFieldExists from './checkFieldExists.js'
export default class SlotDao {
  constructor() {
    this.db = db;
  }
  async checkIfSlotClashes(clinicId,slotDate,startTime,endTime){
     const clashQueryChecker = `
      SELECT COUNT(*) AS isClashed
      FROM SLOT
      where slotDate = ? 
      AND clinicId = ?
      AND ? < endTime 
      AND ? > startTime
    ` 
    const result =  await this.executeQuery(clashQueryChecker,
      [slotDate,clinicId,endTime,startTime]
    ) 
    return result[0].isClashed; 
  } 

  async addClinicSlot(clinicId, slotData = {}) {
    const { slotDate, startTime, endTime} = slotData;
    //check if the slot clashes
    const slotHasClashed =  await this.checkIfSlotClashes(clinicId,slotDate,startTime,endTime); 
    if(slotHasClashed){
      return new Error("Slot has clashed"); 
    }
    const query = `
      INSERT INTO SLOT (ClinicId, slotDate, startTime, endTime, date_added, isAvailable)
      VALUES (?, ?, ?, ?, NOW(),1)
    `;

    return new Promise((resolve, reject) => {
      this.db.execute(query, [clinicId, slotDate, startTime, endTime], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  async openClinicSlot(clinicId, slotId) {
    const query = `
      UPDATE SLOT 
      SET isAvailable = 1
      WHERE ClinicId = ? AND SlotId = ?
    `;

    return new Promise((resolve, reject) => {
      this.db.execute(query, [clinicId, slotId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
  async listClinicUpcomingSlots(clinicId) {
    const query = `
        SELECT SlotId, slotDate, startTime, endTime 
        FROM slot   
        WHERE 
          ClinicId = ? 
          AND TIMESTAMP(slotDate, startTime) > NOW()
        ORDER BY slotDate, startTime
    `;
 
    return new Promise((resolve, reject) => {
       this.db.query(query, [clinicId], (err, results) => {
          if (err) return reject(err);
          resolve(results);
       });
    })} 
    
   async listClinicSlotsByDate(date, clinicId) {
    const query = `
      SELECT slotDate, startTime, endTime FROM SLOT 
      WHERE slotDate = ? AND ClinicId = ? AND 
      
    `;

    return new Promise((resolve, reject) => {
      this.db.query(query, [date, clinicId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  async getSlotById(slotId) {
    const query = `SELECT * FROM SLOT WHERE SlotId = ?`;

    return new Promise((resolve, reject) => {
      this.db.query(query, [slotId], (err, result) => {
        if (err) return reject(err);
        resolve(result.length > 0 ? result[0] : null);
      });
    });
  }

  async deleteSlot(slotId) {
    const query = `DELETE FROM SLOT WHERE SlotId = ?`;

    return new Promise((resolve, reject) => {
      this.db.query(query, [slotId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
  
  async updateSlot(slotId, data = {}) {
    // const { slotDate, startTime, endTime, isAvailable } = data;  
    const {query,values}= await buildUpdateQuery('SLOT',data,"SlotId",slotId,checkFieldExists)
  

    return new Promise((resolve, reject) => {
      this.db.query(query, values, (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  } 
  executeQuery(query, params = []) {
    return new Promise((resolve, reject) => { 
      this.db.query(query, params, function(err, results){  
        console.log("Command,",this.sql); 
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}
