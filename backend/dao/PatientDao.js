 
import bcrypt from "bcryptjs";
import User from './objects/Patient.js'

export default class PatientDao{ 
    //icnumber is not used as PK as it may subject to change
    constructor(db){ 
        this.db = db;
    } 
    //user data expects the following fields: fname, mname, lname, picture, icnumber, email, password
    //birthDate, gender, joinDate 
    async getUserId(icno){
      return new Promise((resolve,reject)=>{
          const query = `SELECT user_id FROM user WHERE icnumber = ?` 
          this.db.query(query,[icno],function(err,result){
             if(err){
                return reject("Error"); 
             } 
             resolve(result[0]); 
          })
      })
    }
    async createUser(icnumber, plainPassword, userData = {}) {
      // ERROR CODES: 1 this.db CREATE ERROR, 2 SUCCESS, 3 USER EXISTS
      const checkUserExists = new Promise((resolve, reject) => {
          const query = `SELECT user_id FROM user WHERE icnumber = ?`;
          this.db.query(query, [icnumber], function (err, result) {
              if (err) {
                  return reject("Error");
              }
              resolve(result.length === 1);
          });
      });
  
      try {
          const userExists = await checkUserExists;
  
          if (!userExists) {
              const hashedPassword = await bcrypt.hash(plainPassword, 12);
  
              return new Promise((resolve, reject) => {
                  const {
                      fname,
                      mname,
                      lname,
                      email,
                      birthDate,
                      gender,
                      joinDate
                  } = userData;
  
                  const query = `
                      INSERT INTO user 
                      (fname, mname, lname, icnumber, email, password, birthDate, gender, joinDate)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
                  this.db.query(
                      query,
                      [
                          fname,
                          mname,
                          lname,
                          icnumber,
                          email,
                          hashedPassword,
                          birthDate,
                          gender,
                          joinDate
                      ],
                      function (err, result) {
                          if (err) {
                            
                              return reject(1); // Error creating user
                          }
                          resolve(result.affectedRows > 0 ? 2 : 1);
                      }
                  );
              });
          } else {
              return 3; // User already exists
          }
      } catch (err) {
      
          return 1;
      }
  }
    async validateCredentials(icnumber, plainPassword){  
      //status code 0: means user does not exist 
      //status code 1: means user enteres the wrong password
      //status code 2: means user successfully logged in
      const userDoesExist =  await this.getUserByIc(icnumber);  
       
       
       if(!userDoesExist){
        return 0; 
       }
       const isMatch = new Promise((resolve,reject)=>{
          const query = `SELECT password FROM user WHERE icnumber = ?` 
          this.db.query(query,[icnumber],function(err,result){
             if(err){
                reject(err); 
                return; 
             } 
             console.log(plainPassword); 
             console.log(result[0].password); 
             bcrypt.compare(plainPassword,result[0].password) 
             .then((match)=>{
                 match ? resolve(2) : resolve(1)
             })
          })
       })   
     
       const matched = await isMatch; 
       return matched; 

    }
    async getUserByIc(icnumber){ 
      
      return new Promise((resolve,reject)=>{
        const query = `SELECT user_id  FROM user WHERE icnumber = ?`;  
        
        this.db.query(query,[icnumber],function(err,result){ 

            if(err){
                reject(err)
            } 
            resolve(new User(result[0]));  
        })
      })
    }
    async deleteUser(icnumber){
        return new Promise((resolve,reject)=>{
           const query = `DELETE FROM USER WHERE icnumber = ?`; 
           this.db.query(query,[icnumber],function(err,result){
            if(err){
              reject(err);
            } 
            resolve(result.affectedRows > 1 ?  true : false); 
           })
        })
    } 
    async listUsers(limitNum = 10, page = 1) {
        return new Promise((resolve, reject) => {
            const offset = limitNum * (page - 1);
            const query = `SELECT * FROM user LIMIT ? OFFSET ?`;
    
            this.db.query(query, [limitNum, offset], function(err, result) {
                if (err) {
                    return reject(err);
                }
                const userList = result.map(user => new User(user));
                resolve(userList);
            });
        });
    }
    
}