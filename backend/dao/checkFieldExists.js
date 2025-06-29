import db from "../db/mysql.js"; 
import { escapeId } from "mysql2";
export default async function checkFieldExists(tableName, field){ 

      const table = escapeId(tableName)
      const query = 
      `DESCRIBE ${table}` 

 return new Promise((resolve,reject)=>{
      db.execute(query,
        function(error,results){
          console.log(results); 
          if(error){
              return reject(error)
          }
          
          return resolve(results.findIndex((result)=>result.Field == field)!= -1); 
        }
     )
 })
    
} 
