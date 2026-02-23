import calculateEstimatedTime from './calculateEstimatedTime.js';
import distance from './distance.js';
import RideDAO from '../dao/RideDAO.js';
import MVAStaffDao from '../dao/MVAStaffDao.js';  
import VehicleDao from '../dao/VehicleDao.js'; 
//output: 
//time in seconds
//distance in meters 



//google map api outputs: 
//duration seconds 
//distance meters

const definedConstants = {
    averageBufferTime: 210, 
    additionBufferTimeForWheelchair: 240,
    maxTotalDistance: 15000, 
    staffBreakAfterSessionEnds: 300, 
    maxWorkload: 5, //defined by number of rides that the staff have
    maxTolerableLateness: 1800, 
    maxTolerableWorkloadExceeded: 4, 
    maxTolerableDistanceExceeded: 35000
};

const rideDao = new RideDAO();  
const staffDao = new MVAStaffDao();  
const vehicleDao = new VehicleDao(); 
//expect to accept staff_ids 1-3 
//staff_id 4 and 5 are marked too far 
//staff_id 5 is for extreme cases 


//gets random int representing minutes
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const staff_current_coordinates = {
    1: { lat: 3.0215832, lng: 101.604402 },
    2: { lat: 3.0832227, lng: 101.594402},
    3: { lat: 4.3283705, lng: 101.614402 }, 
    4: { lat: 3.1369862, lng: 101.594402 }, 
    5: { lat: 2.9957934, lng: 101.574402 }
};

const staff_available_time = { 
    
}

function generateStaffAvailabilityTime(start_time, end_time) {
  const startMs = new Date(start_time).getTime();
  const endMs = new Date(end_time).getTime();

  for (const staffId of Object.keys(staff_current_coordinates)) {
    const startOffset = getRandomInt(-30, -25) * 60000;
    const endOffset = getRandomInt(-10, 200) * 60000;

    staff_available_time[staffId] = {
      start_availability: startMs + startOffset,
      end_availability: endMs + endOffset
    };
  }
}

function to_KM(distanceInMeters){ 
    return distanceInMeters / 1000
}
function to_Minutes(timeInMilliseconds){
     return timeInMilliseconds / (1000*60) 
}
function to_Milliseconds(timeInSeconds){
    return timeInSeconds * 1000
} 
const modes = { 
     Optimistic: 1,
     Pessimistic: 2
}

async function generatePossibleScheduleList(
    appointment_start_time,
    appointment_end_time,
    mode, //mode can be optimistic or pessimistic
    userCoordinates,
    clinicCoordinates,
    requiresWheelchair,
    preferred_language
) {  

    if(mode == null){
        mode = 1; //assume optimistic schedule search 
    }   

    //hardcoded for simulation purposes. 
    generateStaffAvailabilityTime(appointment_start_time,appointment_end_time);  
    
    const possible_schedules = [];     
     //conversion from long form to short form.
    if(userCoordinates.latitude && userCoordinates.longitude){ 
        userCoordinates.lat = userCoordinates.latitude 
        userCoordinates.lng = userCoordinates.longitude
    } 

   if(clinicCoordinates.latitude && clinicCoordinates.longitude){ 
       clinicCoordinates.lat = clinicCoordinates.latitude 
       clinicCoordinates.lng =  clinicCoordinates.longitude
   }
    
    appointment_start_time = new Date(appointment_start_time); 
    appointment_end_time = new Date(appointment_end_time);

    // calculate session buffer 
    const session_buffer = to_Milliseconds(definedConstants.averageBufferTime 
        + (requiresWheelchair ? definedConstants.additionBufferTimeForWheelchair : 0)) ;
    
    // patient → clinic distance & time
    const distance_patient_clinic = await distance(
        userCoordinates.lat, userCoordinates.lng,
        clinicCoordinates.lat, clinicCoordinates.lng
    ); 
    console.log("Calculating distance between user and clinic")
    const estimateTimeToReachClinic = await calculateEstimatedTime(
        userCoordinates.lat, userCoordinates.lng,
        clinicCoordinates.lat, clinicCoordinates.lng
    );

    for (const [staffId, staffCoords] of Object.entries(staff_current_coordinates)) {

        // staff → patient
        const distance_staff_patient = await distance(
            userCoordinates.lat, userCoordinates.lng,
            staffCoords.lat, staffCoords.lng
        ); 
       
        // reject if too far
        if ((distance_staff_patient + distance_patient_clinic > definedConstants.maxTotalDistance 
            && modes[mode] == modes.Optimistic)
             || (((distance_staff_patient + distance_patient_clinic) - definedConstants.maxTotalDistance)  >  definedConstants.maxTolerableDistanceExceeded) 
        ) { 
            console.log((distance_staff_patient + distance_patient_clinic) - definedConstants.maxTotalDistance)
            console.log("Too far")
            continue;
        }
  

        //returns the duration in seconds
        const estimateTimeToReachUser = await calculateEstimatedTime(
            userCoordinates.lat, userCoordinates.lng,
            staffCoords.lat, staffCoords.lng
        );

        // session window
        //session starts when the staff reach user? 
        const session_start_time = new Date(
             staff_available_time[staffId].start_availability +  
             to_Milliseconds(estimateTimeToReachUser)
        ); 

        const session_end_time = new Date(
            appointment_end_time.getTime() 
            + to_Milliseconds(estimateTimeToReachClinic)
        );  

        if(session_end_time >= staff_available_time[staffId].end_availability){  
              console.log("Schedule rejected due to being past the staff's available time.")
              continue; 
        }

        // check overlapping rides
        const rides = await rideDao.getRides({
            date_range: { start: session_start_time.toLocaleString(), end: session_end_time.toLocaleString() }
        }, ["staff_id"]);

        let isConflict = false;
        for (const ride of rides) {
            if (ride.staff_id == staffId) { 
                console.log("Conflict detected")
                isConflict = true;
                break;
            }
        } 

        if (isConflict) continue;

        // workload
        const result = await rideDao.getTotalRidesFromStaff(staffId); 
        const workload =  result[0].totalRides; 
        
        if ((workload > definedConstants.maxWorkload
            && modes[mode] == modes.Optimistic) 
            || (workload - definedConstants.maxWorkload >   definedConstants.maxTolerableWorkloadExceeded)
        ){ 
           console.log("Max workload exceeded"); 
           continue;
        }
        

        // time margin check
        const time_reached_clinic = session_start_time.getTime() 
            + (
            session_buffer //already in milliseconds
            + to_Milliseconds(estimateTimeToReachClinic)) ;

        const time_margin = (time_reached_clinic - appointment_start_time.getTime())
        if ((time_margin > 0 
            && modes[mode] == modes.Optimistic)
            || (time_margin >  definedConstants.maxTolerableLateness * 1000)
        ){ 
            console.log("Late for appointment: ",time_margin/(60000))
            continue;
        }  // too late
         
        let vehicle = null; 
        let vehicles = await vehicleDao.getVehicleByStaff(staffId);  
        vehicle = vehicles[0]    


         if(!vehicle){
            console.log("No vehicle assigned to staff")
            continue; 
         }  

         
        //wheelchair vehicle check 
        if(requiresWheelchair && !vehicle){ 
              if(!vehicle.has_wheelchair){   
                     console.log("No wheelchair")
                     continue;   
              } 
         }     


        
        
        //get staff preferred language  
        const languages = await staffDao.getStaffPreferredLanguages(staffId); 

        // push feasible schedule  for each language separately 
        languages.forEach((language)=>{
             possible_schedules.push({
                staff_id: staffId,   
                wheelchair: requiresWheelchair,    
                vehicle_id:  vehicle.vehicle_id, 
                vehicle_name: vehicle.vehicle_name, 
                plate_number: vehicle.plate_number,
                language: language.language_name, 
                session_start_time: session_start_time.getTime(),
                session_end_time : session_end_time.getTime(), 
                workload,
                distance_staff_patient: to_KM(distance_staff_patient),
                distance_patient_clinic: to_KM(distance_patient_clinic), 
                time_margin: to_Minutes(time_margin),
                preferred_language 
            });
        }) 
        
        
       
    }

    return possible_schedules; // always return array
}

export default generatePossibleScheduleList;