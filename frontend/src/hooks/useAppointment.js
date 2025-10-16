import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../controllers/"
import { AddAppointments, setFetchedAppointments} from "../reducers/appointmentReducer.js"

export default function useAppointment(options) {
  const dispatch = useDispatch();
  const appointments = useSelector(state => state.Appointment.appointments);
  const isAppointmentFetched = useSelector(state => state.Appointment.fetched); 
 useEffect(() => {
  const controller = API.getController("appointment");

  async function fetchAppointments() {
    try {
      const count = await controller.getAppointmentCount({
        option: options.option, 
      });
      if (!isAppointmentFetched) {
        const pageSize = 5;
        const totalPages = Math.ceil(Number(count) / pageSize);
        const pagePromises = [];

        for (let page = 1; page <= totalPages; page++) {
          pagePromises.push(
            controller.getAppointments(page, {
              option: options.option
            })
          );
        }

        const allPages = await Promise.all(pagePromises);
        const fetchedAppointmentList = allPages.flat(); 
        
       dispatch(AddAppointments({ appointments: fetchedAppointmentList }));
       dispatch(setFetchedAppointments(true));

      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  }
 
   fetchAppointments(); 
  
  
   
}, [dispatch, options.option, isAppointmentFetched]);

  return {isAppointmentFetched,appointments};
}