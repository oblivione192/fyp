import db from "../db/mysql.js";

export default class RideDAO {
  constructor() {
    this.db = db;
  }

  /**
   * Book a new ride
   * Schema: ride_id, user_id, staff_vehicle_id, ride_timestamp, booking_date, destination_clinic_id
   * @param {number} user_id - the patient/user ID
   * @param {Object} data - ride details
   */
  

  async bookRide(user_id, data = {}) {
    try {
      const query = `
        INSERT INTO ride (user_id, staff_vehicle_id, ride_timestamp, booking_date, destination_clinic_id)
        VALUES (?, ?, ?, ?, ?)
      `;

      const params = [
        user_id,
        data.staff_vehicle_id,
        data.ride_timestamp,
        new Date(), // booking date is now
        data.destination_clinic_id,
      ];

      return await this.executeQuery(query, params)
      .then((result)=>{
           return {
             insertId: result.insertId,
             status: "OK" 
           } 
      })
     
      ;
    } catch (err) {
      console.error("Error booking ride:", err);
      throw err;
    }
  }

  /**
   * Get rides with optional filters
   * options = { user_id, date_range: { start, end }, destination_clinic_id, staff_vehicle_id }
   * returnFields = array of fields to return, default ["*"]
   */ 

  
  async getTotalRidesFromStaff(staff_id){
     const query = "SELECT COUNT(*) AS totalRides FROM ride WHERE staff_id = ?" ; 
     return this.executeQuery(query,[staff_id]); 
  }

async getRides(options = {}, returnFields = {}) {
  try {
    const fields = [];

    // Default entity-to-table mapping
    const entityMap = {
      Rides: { alias: "r", default: ["*"], table: "ride" },
      Staff: { alias: "s", default: ["staff_id", "staff_fname", "staff_lname"], table: "mvastaff" },
      User: { alias: "u", default: ["user_id", "fname", "lname"], table: "user" },
      Clinic: { alias: "c", default: ["ClinicId", "name"], table: "clinic" },
    };

    // Build SELECT fields
    for (const [entity, config] of Object.entries(entityMap)) {
      const requestedFields = returnFields[entity];

      if (requestedFields && requestedFields.length > 0) {
        fields.push(
          ...requestedFields.map(f => `${config.alias}.${f}`)
        );
      } else if (entity === "Rides" && (!requestedFields || requestedFields.length === 0)) {
        // If Rides not specified, default to all
        fields.push("r.*");
      }
    }

    let query = `SELECT ${fields.join(", ")} FROM ride r`;

    // Add joins only if fields for that entity were requested
    if (returnFields.Staff && returnFields.Staff.length > 0) {
      query += " JOIN mvastaff s ON r.staff_id = s.staff_id";
    }
    if (returnFields.User && returnFields.User.length > 0) {
      query += " JOIN user u ON r.user_id = u.user_id";
    }
    if (returnFields.Clinic && returnFields.Clinic.length > 0) {
      query += " JOIN clinic c ON r.destination_clinic_id = c.ClinicId";
    }

    // Build conditions
    const conditions = [];
    const params = [];

    if (options.user_id) {
      conditions.push("r.user_id = ?");
      params.push(options.user_id);
    }

    if (options.staff_id) {
      conditions.push("r.staff_id = ?");
      params.push(options.staff_id);
    }

    if (options.date_range?.start && options.date_range?.end) {
      conditions.push("r.ride_timestamp BETWEEN ? AND ?");
      params.push(options.date_range.start, options.date_range.end);
    }

    if (options.destination_clinic_id) {
      conditions.push("r.destination_clinic_id = ?");
      params.push(options.destination_clinic_id);
    }

    if (options.staff_vehicle_id) {
      conditions.push("r.staff_vehicle_id = ?");
      params.push(options.staff_vehicle_id);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    console.log("Final Ride Query:", query, params);
    return await this.executeQuery(query, params);
  } catch (err) {
    console.error("Error fetching rides:", err);
    throw err;
  }
}

  /**
   * Execute a query with parameters
   */
  executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.query(query, params, function (err, results) {
        if (err) {
          console.error("SQL Error:", err);
          return reject(err);
        }
        console.log("Executed SQL:", this.sql);
        resolve(results);
      });
    });
  }
}
