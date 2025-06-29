export default class Appointment{
    constructor(appointmentData={}){
        const {AppointmentId, SlotId,DoctorId,PatientId, date, visitPurpose,startTime,endTime} = appointmentData; 
        this.AppointmentId = AppointmentId;
        this.DoctorId = DoctorId;
        this.PatientId = PatientIdl 
        this.date = new Date(date);
        this.visitPurpose=  visitPurpose; 
        this.startTime = startTime;
        this.endTime = endTime;
    } 
    getAppointmentDetails(){
        return{
            date: this.date, 
            visitPurpose: this.visitPurpose,
            startTime : this.startTime,
            endTime : endTime 
        }
    }
    
}