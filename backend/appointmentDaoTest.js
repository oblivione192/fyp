import AppointmentDao from './dao/AppointmentDao.js'; // adjust path as needed

const dao = new AppointmentDao();

async function runTests() {
  console.log("Running AppointmentDao tests...");

  // getAppointmentById
  try {
    const appointment = await dao.getAppointmentById(2);
    console.log("getAppointmentById:", appointment);
  } catch (err) {
    console.error("getAppointmentById Error:", err);
  }

  

  // confirmAppointment
  try {
    const confirmed = await dao.confirmAppointment(2);
    console.log("confirmAppointment:", confirmed);
  } catch (err) {
    console.error("confirmAppointment Error:", err);
  }

  // updateAppointment
  try {
    const updated = await dao.updateAppointment(2, {
      date: '2025-02-01',
      visit_purpose: 'Follow-up',
      startTime: '12:00',
      endTime: '12:30'
    });
    console.log("updateAppointment:", updated);
  } catch (err) {
    console.error("updateAppointment Error:", err);
  }

  // listAppointmentsByDate
  try {
    const appointments = await dao.listAppointmentsByDate('2025-01-01');
    console.log("listAppointmentsByDate:", appointments);
  } catch (err) {
    console.error("listAppointmentsByDate Error:", err);
  }

  

  // listAppointmentsbyClinicSlot (used in router, add if missing)
  try {
    const slotAppointments = await dao.listAppointmentsByClinicSlot(1, 1);
    console.log("listAppointmentsbyClinicSlot:", slotAppointments);
  } catch (err) {
    console.error("listAppointmentsbyClinicSlot Error:", err);
  } 

}

runTests();
