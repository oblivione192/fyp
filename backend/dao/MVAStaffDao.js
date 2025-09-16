import db from "../db/mysql.js";
export default class MVAStaffDao{ 
    constructor(){  
        this.db = db;   
    } 
    async listStaff(){ 
          
    } 
    async getStaffById(staff_id){   

    }  
    async getStaffPreferredLanguages(staff_id){ 
         const query =  `SELECT l.language_name FROM languages l 
                         JOIN stafflanguage sl ON sl.language_id = l.language_id 
                         WHERE sl.staff_id = ? 
          ` 
          return this.executeQuery(query,[staff_id]); 
    } 
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