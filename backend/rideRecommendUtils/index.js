import calculateEstimatedTime from './calculateEstimatedTime.js';
import distance from './distance.js';
import RideDAO from '../dao/RideDAO.js';
import MVAStaffDao from '../dao/MVAStaffDao.js'; 
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
    maxWorkload: 5 
};

const rideDao = new RideDAO();  
const staffDao = new MVAStaffDao(); 
//expect to accept staff_ids 1-3 
//staff_id 4 and 5 are marked too far 
//staff_id 5 is for extreme cases 

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const staff_current_coordinates = {
    1: { lat: 4.3215832, lng: 101.1367282 },
    2: { lat: 4.2832227, lng: 101.154623 },
    3: { lat: 4.3283705, lng: 101.1358976 }, 
    4: { lat: 4.1369862, lng: 101.2409724 }, 
    5: { lat: 5.4857934, lng: 101.0090016 }
};

const staff_available_time = { 
    1: new Date().getTime() - getRandomInt(5, 50)*60000, 
    2: new Date().getTime() - getRandomInt(5, 50)*60000,
    3: new Date().getTime() - getRandomInt(5, 50)*60000,
    4: new Date().getTime() - getRandomInt(5, 50)*60000,
    5: new Date().getTime() - getRandomInt(5, 50)*60000
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
async function generatePossibleScheduleList(
    appointment_start_time,
    appointment_end_time,
    userCoordinates,
    clinicCoordinates,
    requiresWheelchair,
    preferred_language
) {
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
        if (distance_staff_patient + distance_patient_clinic > definedConstants.maxTotalDistance) {
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
             staff_available_time[staffId] +  
             to_Milliseconds(estimateTimeToReachUser)
        ); 

        const session_end_time = new Date(
            appointment_end_time.getTime() 
            + to_Milliseconds(estimateTimeToReachClinic)
        );

        // check overlapping rides
        const rides = await rideDao.getRides({
            date_range: { start: session_start_time, end: session_end_time }
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
        
        if (workload > definedConstants.maxWorkload) continue;

        // time margin check
        const time_reached_clinic = session_start_time.getTime() 
            + (
            session_buffer
            + estimateTimeToReachClinic) * 1000;

        const time_margin = (time_reached_clinic - appointment_start_time.getTime())
        if (time_margin > 0){ 
            console.log("Time wait is too long")
            continue;
        }  // too late
        
        
        //get staff preferred language  
        const languages = await staffDao.getStaffPreferredLanguages(staffId); 
        console.log(languages)

        // push feasible schedule  for each language separately 
        languages.forEach((language)=>{
             possible_schedules.push({
                staff_id: staffId,  
                wheelchair: requiresWheelchair,  
                language: language.language_name, 
                session_start_time,
                session_end_time,
                workload,
                distance_staff_patient: to_KM(distance_staff_patient),
                distance_patient_clinic: to_KM(distance_patient_clinic), 
                time_margin: to_Minutes(time_margin),
                preferred_language 
            });
        }) 

       
    }
    console.log(possible_schedules); 
    return possible_schedules; // always return array
}

export default generatePossibleScheduleList;