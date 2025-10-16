import db from "../db/mysql.js";

export default class VehicleDAO {
  constructor() {
    this.db = db;
  }
  
   async getVehicleById(vehicle_id){ 
       const query = `SELECT * FROM VEHICLE WHERE vehicle_id = ? `
       return this.executeQuery(query,[vehicle_id]) 
   } 
   
   async getVehicleByStaff(staff_id){ 
       const query =   `   
            SELECT 
            v.*, 
            CONCAT(s.staff_fname, ' ', s.staff_lname) AS staffName, 
            sv.registration_date AS vehicleRegistrationDate
            FROM staffvehicle sv
            JOIN vehicle v ON sv.vehicle_id = v.vehicle_id
            JOIN mvastaff s ON sv.staff_id = s.staff_id
            WHERE s.staff_id = ?; 
        `
       return this.executeQuery(query,[staff_id])
   }

   
  /**
   * Execute a query with parameters
   */

   executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.query(query, params, function (err, results) {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

}
