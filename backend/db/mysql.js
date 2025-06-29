import mysql2 from 'mysql2' 

console.log(process.env.DB_HOST); 
const db = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,  
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  waitForConnections:true, 
  connectionLimit: 10, 
  queueLimit: 0
}) 

db.getConnection(function(err,connection){
  if(err){
    console.log("Server cannot be started"); 
    process.exit(1); 
  }
  else{
    console.log('SQL server established'); 
  }
}) 
export default db;
