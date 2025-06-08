import db from "../db/mysql.js";

export default class SlotDao {
  constructor() {
    this.db = db;
  }

  async addClinicSlot(clinicId, slotData = {}) {
    const { slotDate, startTime, endTime } = slotData;
    const query = `
      INSERT INTO SLOT (ClinicId, slotDate, startTime, endTime)
      VALUES (?, ?, ?, ?)
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
       WHERE slotDate > CURDATE() 
         AND ClinicId = ? 
         AND isAvailable = 1
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
      isAvailable = 1
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
    const { slotDate, startTime, endTime, isAvailable } = data;
    const query = `
      UPDATE SLOT 
      SET slotDate = ?, startTime = ?, endTime = ?, isAvailable = ?
      WHERE SlotId = ?
    `;

    return new Promise((resolve, reject) => {
      this.db.query(query, [slotDate, startTime, endTime, isAvailable, slotId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
}
