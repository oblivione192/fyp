
import PatientDao from "./PatientDao.js";
export default class UserDao { 
  static getPatientDao(){
    return new PatientDao(); 
  }
}
