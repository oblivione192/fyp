

import db from '../db/mysql.js';

export default class ServiceDao {
  constructor() {
    this.db = db;
  }

  // List all services
  async listAllServices() {
    const query = `SELECT * FROM Services`;
    return new Promise((resolve, reject) => {
      this.db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  // Add a new service
  async addService(serviceName, serviceDescription) {
    const query = `INSERT INTO Services (service_name, service_description) VALUES (?, ?)`;
    return new Promise((resolve, reject) => {
      this.db.execute(query, [serviceName, serviceDescription], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  }

  // Assign a service to a clinic
  async assignServiceToClinic(clinicId, serviceId, price = 0.0, duration = 30) {
    const query = `INSERT INTO ClinicService (clinic_id, service_id, price, duration_minutes) VALUES (?, ?, ?, ?)`;
    return new Promise((resolve, reject) => {
      this.db.execute(query, [clinicId, serviceId, price, duration], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  }

  // List services offered by a specific clinic
  async listServicesByClinic(clinicId) {
    const query = `
      SELECT cs.clinic_service_id, s.service_id, s.service_name, s.service_description, cs.price, cs.duration_minutes
      FROM ClinicService cs
      JOIN Services s ON cs.service_id = s.service_id
      WHERE cs.clinic_id = ?
    `;
    return new Promise((resolve, reject) => {
      this.db.query(query, [clinicId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  // Delete a service by ID
  async deleteService(serviceId) {
    const query = `DELETE FROM Services WHERE service_id = ?`;
    return new Promise((resolve, reject) => {
      this.db.execute(query, [serviceId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  // Remove a service from a clinic
  async removeServiceFromClinic(clinicServiceId) {
    const query = `DELETE FROM ClinicService WHERE clinic_service_id = ?`;
    return new Promise((resolve, reject) => {
      this.db.execute(query, [clinicServiceId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
}
