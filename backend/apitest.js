const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjp7InVzZXJfaWQiOjF9LCJpYXQiOjE3NDkxODYyODJ9.uOJzjqUUmh_ALh2xnp7X-I-_5KLao014pdp-Tf-oSC4"
// fetch("http://localhost:3000/api/appointment/appointmentHistory?user_id=1&page=1",
//     {
//         headers:{
//                 "Authorization": `Bearer ${token}`
//         }
//     }
// )
// .then((resp)=>{
//     return resp.json(); 
// })
// .then((data)=>{
//     console.log("Appointment History: ",data); 
// })

// fetch("http://localhost:3000/api/appointment/pendingAppointments?page=1",

//     {
//         headers:{
//             "Authorization" : `Bearer ${token}`
//         }
//     }
// )
// .then((resp)=>{
//     return resp.json();
// })
// .then((data)=>{
//     console.log("All  Appointments: ", data);
// })
// .catch((err)=>{
//     console.log(err); 
// })
// fetch("http://localhost:3000/api/appointment/confirmedAppointments?page=1",

// )
// .then((resp)=>{
//     return resp.json();
// }) 
// .then((data)=>{
//     console.log("Confirmed Appointments: ",data); 
// })
// fetch("http://localhost:3000/api/appointment/count",
//     {
//         headers:{
//             "Authorization":`Bearer ${token}`
//         }
//     }
// ) 
// .then((resp)=>{
//     return resp.json(); 
// })
// .then((result)=>{
//     console.log("Total Appointments: ", result.totalAppointments)
// })
// fetch("http://localhost:3000/api/appointment/getSlots?clinicId=1&option=Upcoming",
//     {
//         headers:{
//             "Authorization":`Bearer ${token}`
//         }
//     }
// )
// .then((resp)=>{
//   return resp.json(); 
// })
// .then((data)=>{
//     console.log("slots: "+ data); 
// }) 

fetch("http://localhost:3000/api/appointment/postponeAppointment", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({
    AppointmentId: 21,
    SlotId: 19,
    newStartTime: "13:00:00",
    newEndTime: "15:00:00",
  })
})
  .then(res => res.text())
  .then(data => console.log("✅ Success:", data))
  .catch(err => console.error("❌ Error:", err));

