import db from '../db/mysql.js';

export default class ClinicDao {
  constructor() {
    this.db = db; 
  }
  async getClinicEnrollmentsByClinicId(clinicId){
     const query = ` 
      SELECT d.DoctorId, d.fname, d.mname, d.lname,  de.enrollment_date, de.enrollment_status FROM doctorenrollment de 
      JOIN clinic c on de.ClinicID = c.ClinicId 
      JOIN doctor d on de.doctorid = d.doctorid 
      where c.clinicid = ?
     `
     return new Promise((resolve,reject)=>{
       this.db.query(query,[clinicId],(err,results)=>{
          if(err) return reject(err); 
          resolve(results); 
       })
     })
  }
  async getClinicById(clinic_id){
     const query =  ` 
       SELECT ClinicId, name, address,
       ST_Y(location) as longitude, 
       ST_X(location) as latitude
       FROM clinic 
       WHERE clinicid = ? 
      `
      return new Promise((resolve,reject)=>{
         this.db.query(query,[clinic_id],(err,results)=>{
            if(err) return reject(err); 
            resolve(results); 
         })
      })
  }
  async getClinicByRegNo(regNo){
     const query = `
       SELECT ClinicId, name, address, 
       ST_X(location) as latitude, 
       ST_Y(location) as longitude
       FROM clinic
       WHERE registration_no = ? 
     ` 
     return new Promise((resolve,reject)=>{
        this.db.query(query,[regNo],(err,results)=>{
            if(err) return reject(err); 
            resolve(results);
        })
     })
  }
  async listClinicByService(service_id) {
    const query = `
      SELECT c.ClinicId, c.name, c.address, cs.price, cs.duration_minutes,
      ST_X(c.location) as latitude, 
      ST_Y(c.location) as longitude 
      FROM ClinicService cs
      JOIN Clinic c ON cs.clinic_id = c.ClinicId
      WHERE cs.service_id = ?
    `;
  
    return new Promise((resolve, reject) => {
      this.db.query(query, [service_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }  
  async listClinicsBySpecialty(specialtyId) {
    const query = `
      SELECT c.* FROM CLINIC c
      JOIN SPECIALTY s ON c.SpecialtyId = s.SpecialtyId
      WHERE s.SpecialtyId = ?
    `;

    return new Promise((resolve, reject) => {
      this.db.query(query, [specialtyId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  async listDoctorsFromClinic(clinicId) {
    const query = `
      SELECT d.* FROM DOCTOR d
      JOIN DOCTOR_ENROLLMENT de ON d.DoctorId = de.DoctorId
      WHERE de.ClinicId = ?
    `;

    return new Promise((resolve, reject) => {
      this.db.query(query, [clinicId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  async listSlotsFromClinic(clinicId) {
    const query = `
      SELECT * FROM SLOT
      WHERE ClinicId = ?
    `;

    return new Promise((resolve, reject) => {
      this.db.query(query, [clinicId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  async listAppointmentsFromClinic(clinicId) {
    const query = `
      SELECT a.* FROM APPOINTMENT a
      JOIN SLOT s ON a.SlotId = s.SlotId
      WHERE s.ClinicId = ?
    `;

    return new Promise((resolve, reject) => {
      this.db.query(query, [clinicId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  async addClinic(clinicData = {}) {
    const { ClinicId, ClinicName, Address, PhoneNumber, SpecialtyId } = clinicData;
    const query = `
      INSERT INTO CLINIC (ClinicId, ClinicName, Address, PhoneNumber, SpecialtyId)
      VALUES (?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      this.db.execute(query, [ClinicId, ClinicName, Address, PhoneNumber, SpecialtyId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  async listClinics() {
    const query = `SELECT * FROM CLINIC`;

    return new Promise((resolve, reject) => {
      this.db.query(query, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}
