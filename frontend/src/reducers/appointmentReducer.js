import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  currentPage: 1,  
  totalPages: 0,
  pageSize: 5,
  fetched: false,
  totalAppointments: 0,
};
//Adds all the appointments.
const AppointmentsReducer = createSlice({
  name: 'Appointment',
  initialState,
  reducers: { 
    setFetchedAppointments:(state,action) =>{  
      //expects action.payload to be true or false. 
       state.fetched =  action.payload; 
    },
    InitAllAppointments: (state, action) => {
      state.appointments = [...action.payload.appointments];
      state.totalAppointments = state.appointments.length;
      state.totalPages = Math.ceil(state.totalAppointments / state.pageSize); 
    },
    AddAppointment: (state, action) => {
      state.appointments.push(action.payload.newAppointment);
      state.totalAppointments += 1;
      state.totalPages = Math.ceil(state.totalAppointments / state.pageSize); 
    }, 
    AddAppointments:(state,action)=> { 
       state.appointments.push(...action.payload.appointments); 
       state.totalAppointments += action.payload.appointments.length; 
       state.totalPages =  Math.ceil(state.totalAppointments / state.pageSize);  
    }, 
    RemoveAppointment: (state, action) => {
      state.appointments = state.appointments.filter(
        (appointment) => appointment.AppointmentId !== action.payload.deletedAppointmentId
      );
      state.totalAppointments -= 1;
      state.totalPages = Math.ceil(state.totalAppointments / state.pageSize); 
    },
    UpdateAppointment: (state, action) => {
        const index = state.appointments.findIndex(
          (appointment) => appointment.AppointmentId === action.payload.updatedAppointment.AppointmentId
        ); 

        if (index !== -1) {
          for (const [key, value] of Object.entries(action.payload.updatedAppointment)) {
            state.appointments[index][key] = value;
          }
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
   
  },
});

export const {
  updateTotalPages,
  setFetchedAppointments,
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