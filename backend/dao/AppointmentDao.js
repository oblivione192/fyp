import { escapeId } from 'mysql2';
import db from '../db/mysql.js';

export default class AppointmentDao {
  constructor() {
    this.db = db;
  } 
  async getUserAppointmentCount(PatientId){
    const query = `
    SELECT COUNT(*) AS totalAppointments FROM APPOINTMENT WHERE PatientId = ?; 
    ` 
    const result =  await this.executeQuery(query,[PatientId]);  
    return result[0].totalAppointments;
  }
  async getUserPendingAppointments(PatientId,page,itemsPerPage){
     const offset = itemsPerPage * (page - 1);
     const query = 
     `
      SELECT 
          CONCAT(u.fname, ' ', u.mname, ' ', u.lname) AS patient_name,
          c.address,
          c.name AS clinicName, 
          a.AppointmentId,
          a.date,
          a.startTime,
          a.endTime
        FROM Clinic c
        JOIN Slot s ON s.ClinicId = c.ClinicId
        JOIN Appointment a ON a.SlotId = s.SlotId
        JOIN User u ON a.PatientId = u.user_id
        WHERE u.user_id = ?
        AND a.date > CURDATE() 
        AND a.CONFIRMED = 0
        LIMIT ?
        OFFSET ?
     `
     return this.executeQuery(query,[PatientId,itemsPerPage,offset]); 
  } 

  async utilCheckAppointmentClash(PatientId, SlotId, startTime, endTime) {
      const query = `
        SELECT a.AppointmentId
        FROM Appointment a
        JOIN Slot s ON s.SlotId = a.SlotId
        WHERE a.PatientId = ?
          AND s.slotDate = (
            SELECT slotDate FROM Slot WHERE SlotId = ? LIMIT 1
          )
          AND (? < a.endTime AND ? > a.startTime);
      `;

      const params = [PatientId, SlotId, startTime, endTime];
      const result = await this.executeQuery(query, params);
      return result.length > 0; // true = clash found
}

  async getUserUpcomingAppointments(PatientId,page,itemsPerPage){
    const offset =  itemsPerPage * (page - 1); 
    const query = 
    `
    SELECT 
          CONCAT(u.fname, ' ', u.mname, ' ', u.lname) AS patient_name,
          c.address,
          c.name AS clinicName, 
          a.AppointmentId,
          s.SlotDate as date, 
          a.startTime,
          a.endTime,
          CONCAT('Dr. ', d.fname) AS doctorName
        FROM Clinic c
        JOIN Slot s ON s.ClinicId = c.ClinicId
        JOIN Appointment a ON a.SlotId = s.SlotId
        JOIN User u ON a.PatientId = u.user_id
        JOIN Doctor d ON a.DoctorId = d.DoctorId
        WHERE u.user_id = ? AND  a.date > CURDATE() AND a.CONFIRMED = 1
        LIMIT ?
        OFFSET ?
    ` 
    return this.executeQuery(query,[PatientId,itemsPerPage,offset]); 
  }
  async getUserAppointmentHistory(PatientId,page,itemsPerPage){ 
    const offset = itemsPerPage * (page - 1); 
    const query = `
        SELECT 
          CONCAT(u.fname, ' ', u.mname, ' ', u.lname) AS patient_name,
          c.address,
          c.name AS clinicName,
          a.date,
          a.startTime,
          a.endTime,
          CONCAT('Dr. ', d.fname) AS doctorName
        FROM Clinic c
        JOIN Slot s ON s.ClinicId = c.ClinicId
        JOIN Appointment a ON a.SlotId = s.SlotId
        JOIN User u ON a.PatientId = u.user_id
        JOIN Doctor d ON a.DoctorId = d.DoctorId
        WHERE u.user_id = ? AND  a.date < CURDATE() AND a.attended = 1
        LIMIT ${itemsPerPage} 
        OFFSET ${offset}
    `

    return this.executeQuery(query,[PatientId]); 
  } 

  async getUserAppointments(PatientId, page, itemsPerPage){    
    console.log("Patient Id: ",PatientId)
    const offset =  itemsPerPage * (page - 1); 
    const query =  
    `
      SELECT 
        CONCAT(u.fname, ' ', u.mname, ' ', u.lname) AS patient_name,
        c.address,
        c.clinicId, 
        c.name AS clinicName, 
        a.AppointmentId,  
        a.attended,
        a.CONFIRMED as confirmed, 
        s.SlotDate as date,
        a.startTime,
        a.endTime,
        CASE 
          WHEN d.DoctorId IS NOT NULL THEN CONCAT('Dr. ', d.fname)
          ELSE NULL
        END AS doctorName
        FROM Clinic c
        JOIN Slot s ON s.ClinicId = c.ClinicId
        JOIN Appointment a ON a.SlotId = s.SlotId
        JOIN User u ON a.PatientId = u.user_id
        LEFT JOIN Doctor d ON a.DoctorId = d.DoctorId
        WHERE u.user_id = ?
        LIMIT ${itemsPerPage} 
        OFFSET ${offset}
    `
     return this.executeQuery(query,[PatientId]); 
  }
  async listAppointmentsByClinicSlot(SlotId, ClinicId) {
    const query = `
      SELECT a.*, s.slotDate, s.startTime AS slotStart, s.endTime AS slotEnd, 
             c.name AS clinicName, d.DoctorId, CONCAT(u.fname,u.mname,u.lname) AS patientName
      FROM Appointment a
      JOIN Slot s ON a.SlotId = s.SlotId
      JOIN Clinic c ON s.ClinicId = c.ClinicId
      JOIN User u ON a.PatientId = u.user_id
      JOIN Doctor d ON a.DoctorId = d.DoctorId
      WHERE s.SlotId = ? AND c.ClinicId = ?
    `;

    return this.executeQuery(query, [SlotId, ClinicId]);
  }
  async getLatestAppointmentFromUser(user_id){
    const query = ` 
      SELECT a.*, s.slotDate, s.startTime, s.endTime, d.DoctorId, c.name AS clinicName
      FROM Appointment a
      JOIN Slot s ON a.SlotId = s.SlotId
      LEFT JOIN Doctor d ON a.DoctorId = d.DoctorId
      JOIN Clinic c ON s.ClinicId = c.ClinicId
      WHERE a.PatientId = ?
      ORDER BY a.AppointmentId Desc
      LIMIT 1
    `
    const result = await this.executeQuery(query,[user_id]); 
    return result.length > 0? result[0] : null; 
  }
  async getAppointmentById(AppointmentId) {
    const query = `
      SELECT a.*, s.slotDate, CONCAT(u.fname,u.mname,u.lname) AS patientName, d.DoctorId
      FROM Appointment a
      JOIN Slot s ON a.SlotId = s.SlotId
      JOIN User u ON a.PatientId = u.user_id
      JOIN Doctor d ON a.DoctorId = d.DoctorId
      WHERE a.AppointmentId = ?
    `;

    const result = await this.executeQuery(query, [AppointmentId]);
    return result.length > 0 ? result[0] : null;
  }

  async listAppointmentsByPatient(PatientId) {
    const query = `
      SELECT a.*, s.slotDate, s.startTime, s.endTime, d.DoctorId, c.name AS clinicName
      FROM Appointment a
      JOIN Slot s ON a.SlotId = s.SlotId
      JOIN Doctor d ON a.DoctorId = d.DoctorId
      JOIN Clinic c ON s.ClinicId = c.ClinicId
      WHERE a.PatientId = ?
    `;

    return this.executeQuery(query, [PatientId]);
  }

  async listAppointmentsByDate(date) {
    const query = `
      SELECT a.*, CONCAT(u.fname,u.mname,u.lname) AS patientName, d.DoctorId, s.slotDate
      FROM Appointment a
      JOIN User u ON a.PatientId = u.user_id
      JOIN Doctor d ON a.DoctorId = d.DoctorId
      JOIN Slot s ON a.SlotId = s.SlotId
      WHERE a.date = ?
    `;

    return this.executeQuery(query, [date]);
  }

  async createAppointment(SlotId, DoctorId, PatientId, data = {}) {0
    const { date, visit_purpose, startTime, endTime } = data;
    const query = `
      INSERT INTO Appointment 
        (SlotId, DoctorId, PatientId, visit_purpose, startTime, endTime, CONFIRMED) 
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `;

    const result = await this.executeQuery(query, [SlotId, DoctorId, PatientId, date, visit_purpose, startTime, endTime]);
    return result.affectedRows > 0;
  }

  async deleteAppointment(AppointmentId) {
    const query = `DELETE FROM Appointment WHERE AppointmentId = ?`;
    const result = await this.executeQuery(query, [AppointmentId]);
    return result.affectedRows > 0;
  }

  async confirmAppointment(AppointmentId) {
    const query = `UPDATE Appointment SET CONFIRMED = 1 WHERE AppointmentId = ?`;
    const result = await this.executeQuery(query, [AppointmentId]);
    return result.affectedRows > 0;
  }
  async updateAppointment(AppointmentId,field,newValue){ 
    const escField= escapeId(field); 
    const query = 
    ` 
    UPDATE Appointment
    SET ${escField} = ?
    WHERE AppointmentId = ? 
    ` 
    const result = await this.executeQuery(query,[newValue,AppointmentId]);  
    return result.affectedRows > 0;  
  } 
  
  async updateAppointment(AppointmentId, data = {}) {
     if (!AppointmentId || Object.keys(data).length === 0) return false;

      const fields = Object.keys(data);
      const values = Object.values(data);

      // Join keys with placeholders
      const updateQuery = fields.map(field => `${field} = ?`).join(', ');

      const query = `
        UPDATE Appointment 
        SET ${updateQuery}
        WHERE AppointmentId = ?
      `;

      values.push(AppointmentId); // Add AppointmentId to the end for WHERE clause

      const result = await this.executeQuery(query, values);
      return result.affectedRows > 0;
  }

  // ✅ Reusable method for all DB queries
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
