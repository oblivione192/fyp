import AppointmentController from "./appointmentController"; 
import MedicationController from "./medicationsController"; 
import ProfileController from "./profileController"; 
import HealthRecordController from "./healthRecordController"; 
import ClinicController from "./clinicController";
import LocationController from "./locationController";
import RideController from "./rideController";

class API {

  static setHeaders(headers) {
    this.Headers = headers;
    this.#controllers = null; 
  }

  static #controllers = null;

  static #initControllers() {
    console.log("Request headers ", this.Headers );
    this.#controllers = {
      appointment: new AppointmentController(this.Headers),
      medication: new MedicationController(this.Headers),
      profile: new ProfileController(this.Headers),
      health: new HealthRecordController(this.Headers),
      clinic: new ClinicController(this.Headers),
      location: new LocationController(this.Headers),
      ride: new RideController(this.Headers)
    };
  }
  static getHeaders(){
     return this.Headers;
  }
  static updateHeaders(entry){
     Object.assign(this.Headers,entry);  
     this.#controllers = null; 
  }
  static getController(name) {  
    console.log("Headers: ",this.Headers);  
    console.log("Controller Name: ",name) 
    if (!this.#controllers) {
      this.#initControllers();
    }

    const key = name.toLowerCase();

    if (!(key in this.#controllers)) {
      throw new Error(`Controller "${name}" not found.`);
    }

    return this.#controllers[key];
  }
}






export default API; 


