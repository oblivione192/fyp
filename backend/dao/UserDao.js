import PatientDao  from './PatientDao.js'  
import AdminDao from './AdminDao.js';
import db from '../db/mysql.js'; 
export default class UserDao { 
  static getPatientDao(){
    return new PatientDao(db); 
  }
  static getAdminDao(){
     return new AdminDao(db); 
  }
} 