import db from '../db/mysql.js'

class DoctorDao {
  constructor(db) {
    this.db = db
  }

  // Method to add a new doctor
  async addDoctor(doctor) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO doctors (SpecialtyId, picture, degree, contactNo, email, dob)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      this.db.execute(
        query,
        [doctor.SpecialtyId, doctor.picture, doctor.degree, doctor.contactNo, doctor.email, doctor.dob],
        (err, results) => {
          if (err) return reject(err);
          resolve(results.insertId); // Return the DoctorId of the newly inserted doctor
        }
      );
    });
  }

  // Method to list all doctors
  async listDoctors() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM doctors';
      this.db.execute(query, (err, results) => {
        if (err) return reject(err);
        resolve(results); // Return a list of all doctors
      });
    });
  }

  // Method to find a doctor by their ID
  async getDoctorById(doctorId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM doctors WHERE DoctorId = ?';
      this.db.execute(query, [doctorId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]); // Return the doctor with the given ID
      });
    });
  }

  // Method to update a doctor's details
  async updateDoctor(doctorId, doctorData) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE doctors
        SET SpecialtyId = ?, picture = ?, degree = ?, contactNo = ?, email = ?, dob = ?
        WHERE DoctorId = ?
      `;
      this.db.execute(
        query,
        [
          doctorData.SpecialtyId,
          doctorData.picture,
          doctorData.degree,
          doctorData.contactNo,
          doctorData.email,
          doctorData.dob,
          doctorId
        ],
        (err, results) => {
          if (err) return reject(err);
          resolve(results.affectedRows); // Return the number of affected rows (should be 1 if successful)
        }
      );
    });
  }

  // Method to delete a doctor by their ID
  async deleteDoctor(doctorId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM doctors WHERE DoctorId = ?';
      this.db.execute(query, [doctorId], (err, results) => {
        if (err) return reject(err);
        resolve(results.affectedRows); // Return the number of affected rows (should be 1 if successful)
      });
    });
  }

  // Method to list doctors by specialty ID
  async listDoctorsBySpecialty(specialtyId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM doctors WHERE SpecialtyId = ?';
      this.db.execute(query, [specialtyId], (err, results) => {
        if (err) return reject(err);
        resolve(results); // Return the list of doctors for the given specialty
      });
    });
  }

  // Method to list doctors by clinic ID (assuming there's a relationship with clinics)
  async listDoctorsByClinic(clinicId) {
    return new Promise((resolve, reject) => {
      // Assuming there is a "doctor_clinic" join table
      const query = `
        SELECT d.* FROM doctors d
        JOIN doctor_clinic dc ON d.DoctorId = dc.DoctorId
        WHERE dc.ClinicId = ?
      `;
      this.db.execute(query, [clinicId], (err, results) => {
        if (err) return reject(err);
        resolve(results); // Return the list of doctors for the given clinic
      });
    });
  }

  // Method to list doctors by their contact number
  async listDoctorsByContact(contactNo) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM doctors WHERE contactNo = ?';
      this.db.execute(query, [contactNo], (err, results) => {
        if (err) return reject(err);
        resolve(results); // Return the list of doctors with the given contact number
      });
    });
  }

  // Method to list doctors by their email
  async listDoctorsByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM doctors WHERE email = ?';
      this.db.execute(query, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results); // Return the doctor with the given email
      });
    });
  }

  // Method to find doctors by date of birth range
  async listDoctorsByDobRange(startDate, endDate) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM doctors WHERE dob BETWEEN ? AND ?';
      this.db.execute(query, [startDate, endDate], (err, results) => {
        if (err) return reject(err);
        resolve(results); // Return the list of doctors born between the specified dates
      });
    });
  }
}

module.exports = DoctorDao;
