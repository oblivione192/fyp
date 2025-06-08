import PatientDao  from './PatientDao.js' 
import db from '../db/mysql.js';
export default class UserDao { 
  static getPatientDao(){
    return new PatientDao(db); 
  }
}