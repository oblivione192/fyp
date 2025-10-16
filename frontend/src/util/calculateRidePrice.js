export default function calculateRidePrice( 
    distance_staff_patient,
    distance_patient_clinic, 
    duration
){ 
      return Math.round(distance_staff_patient*4.0 + distance_patient_clinic*5.0 + (duration /60)  * 10,2) ; 
}  
