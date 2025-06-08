import db from '../db/mysql.js';

export default class ClinicDao {
  constructor() {
    this.db = db;
  }
  async listClinicByService(service_id) {
    const query = `
      SELECT c.ClinicId, c.name, c.address, cs.price, cs.duration_minutes
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
