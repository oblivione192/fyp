import { useDispatch,useSelector } from "react-redux"; 
import { useEffect } from "react";
import { AddAppointments,setChangesRead } from "../reducers/appointmentReducer";
import API from "../controllers";
export default function useAppointment(){ 
     const dispatch = useDispatch();   
    
     const totalAppointments = useSelector(state => state.Appointment.totalAppointments); 
     const isModifiedInBackend = useSelector(state => state.Appointment.modifiedInBackend); 
     const totalPages = useSelector(state => state.Appointment.totalPages) 
     const appointments = useSelector(state => state.Appointment.appointments); 
    useEffect(()=>{   
    
       API.getController('appointment')
       .getAppointmentCount(isModifiedInBackend).then((count)=>{ 
    
        if(totalAppointments < Number(count)){
            
            API.getController('appointment').getUserAppointments(totalPages + 1)
            .then((appointments)=>{
                dispatch(AddAppointments(
                    {
                        appointments: appointments
                    }
                ))
            })
          }
          else{
             dispatch(setChangesRead({
                isRead: true
             })) 
          }
          
        }); 
     
    },[dispatch,totalAppointments,isModifiedInBackend,totalPages]) 

    return appointments;
}