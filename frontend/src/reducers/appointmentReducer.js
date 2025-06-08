import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  currentPage: 1, 
  modifiedInBackend: false, 
  totalPages: 1,
  pageSize: 5,
  totalAppointments: 0,
};
//Adds all the appointments.
const AppointmentsReducer = createSlice({
  name: 'Appointment',
  initialState,
  reducers: {
    InitAllAppointments: (state, action) => {
      state.appointments = [...action.payload.appointments];
      state.totalAppointments = state.appointments.length;
      state.totalPages = Math.ceil(state.totalAppointments / state.pageSize); 
    },
    AddAppointment: (state, action) => {
      state.appointments.push(action.payload.newAppointment);
      state.totalAppointments += 1;
      state.totalPages = Math.ceil(state.totalAppointments / state.pageSize); 
      state.modifiedInBackend = true
    }, 
    AddAppointments:(state,action)=> { 
       state.appointments.push(...action.payload.appointments); 
       state.totalAppointments = state.appointments.length; 
       state.totalPages =  Math.ceil(state.totalAppointments / state.pageSize);  
       state.modifiedInBackend = true
    }, 
    RemoveAppointment: (state, action) => {
      state.appointments = state.appointments.filter(
        (appointment) => appointment.AppointmentId !== action.payload.deletedAppointmentId
      );
      state.totalAppointments -= 1;
      state.totalPages = Math.ceil(state.totalAppointments / state.pageSize); 
      state.modifiedInBackend = true
    },
    UpdateAppointment: (state, action) => {
      const index = state.appointments.findIndex(
        (appointment) => appointment.AppointmentId === action.payload.updatedAppointment.AppointmentId 
              
      ); 
      if (index !== -1) { 
        for(const [key,value] of Object.entries(state.updatedAppointment)){
            state.appointments[index][key] = value; 
        }
      } 
      else{
            state.modifiedInBackend = true
      }
    },
    updateCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearAll: (state) => {
      state.appointments = [];
      state.totalAppointments = 0;
      state.currentPage = 1;
      state.totalPages = 1;
    },
    setChangesRead : (state,action) =>{
        state.modifiedInBackend = !action.payload.isRead;
    } 
  },
});

export const {
  updateTotalPages,
  InitAllAppointments,
  AddAppointment,
  AddAppointments,
  RemoveAppointment,
  UpdateAppointment,
  updateCurrentPage,
  setChangesRead,
  clearAll,
} = AppointmentsReducer.actions;

export default AppointmentsReducer.reducer;