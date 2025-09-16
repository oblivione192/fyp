import checkFieldExists from './checkFieldExists.js'
import db from '../db/mysql.js' 
import { escapeId } from 'mysql2'; 
import buildUpdateQuery from './buildUpdateQuery.js';
export default class ProfileDao{   
    constructor(){
         this.db = db; 
    }

    //Part of the Users and Doctors and Admins table
    async getProfile(userType, user_id) {
        userType = userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase()
        let query = "";
        try{
             switch (userType) {
              case "User":
                  query = "SELECT fname, mname, lname, picture, icnumber, email, address, wheelchairNeeded, preferredLanguage FROM user WHERE user_id = ?";
                  break;
              case "Doctor":
                  query = "SELECT fname, mname, lname, dob, email, contactNO, degree, picture FROM doctor WHERE DoctorId = ?";
                  break;
              case "Admin": 
                  query = "SELECT name as username,email FROM admin WHERE AdminId = ?"   
                  break; 
              default:
                  throw new Error("Invalid user type");
        }

        return this.executeQuery(query,[user_id]); 
        }
        catch(err){ 
          console.log(err); 
          return err.message
        }
    }
      async updateProfile(userType, field, value, user_id) {
          const validRoles = ["User", "Doctor", "Admin"];
          
        
          userType = userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase();
          
        
          if (!validRoles.includes(userType)) {
              throw new Error("Invalid role provided");
          }
        
          const tableName = userType.toLowerCase();


          const fieldExists = await checkFieldExists(tableName, field);
          if (!fieldExists) {
              throw new Error("Invalid field provided");
          }

          const primaryKey = userType === "User" ? "user_id" :
                            userType === "Admin" ? "AdminId" :
                            "DoctorId";
            console.log("User type to update: " ,userType)
          const query = `UPDATE ${tableName} SET ${field} = ? WHERE ${primaryKey} = ?`;
          return this.executeQuery(query, [value, user_id]);
}
  async updateProfileBulk(userType,fields,user_id){    

      userType = userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase();
      const primaryKey = userType === "User" ? "user_id" :
                            userType === "Admin" ? "AdminId" :
                            "DoctorId";   
                            
       const {query, values} =  await buildUpdateQuery(
         userType,
         fields,
         primaryKey,
         user_id,
         checkFieldExists
       )
       return this.executeQuery(query,values);
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