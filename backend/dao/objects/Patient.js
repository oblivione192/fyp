import AppointmentDao from "../AppointmentDao.js";
export default class User{
    constructor(userData={}){
        try{
          const {user_id,fname,mname,lname,icnumber,picture,email,password,birthDate,gender,joinDate} = userData;  
          this.appDao = new AppointmentDao();  
          this.user_id=user_id;
          this.fname=fname; 
          this.mname=mname;
          this.lname=lname;
          this.icnumber=icnumber;
          this.picture=picture;
          this.email=email;
          this.password=password; 
          this.birthDate=birthDate; 
          this.gender=gender; 
          this.joinDate=joinDate; 
          this.appointments=[];  
        } 
        catch{
          throw new Error('Invalid or empty attributes'); 
        }
    } 
    async getDoctors(){
       
    } 
    async getAppointments(){ 
      this.appDao.listAppointmentsbySlot();  
      
    }
    async getRides(){ 
      
    }
  }