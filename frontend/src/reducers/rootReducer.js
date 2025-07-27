import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer.js';
import appointmentsReducer from './appointmentReducer.js';
import healthReducer from './healthRecordReducer.js';
import profileReducer from './profileReducer.js';
import enrollmentReducer from './enrollmentReducer.js'
const appReducer = combineReducers({
  Auth: authReducer,
  Appointment: appointmentsReducer,
  Health: healthReducer,
  Profile: profileReducer,
  Enrollment: enrollmentReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'LOG_OUT') {
    return appReducer(undefined, { type: undefined });
  }
  return appReducer(state, action);
};

export default rootReducer;


