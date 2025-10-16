const response = await fetch("http://localhost:3000/api/mva/ride/recommendRides",
    {
          method: 'POST',
          headers: { 
             "Content-Type":"application/json", 
             "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjp7InVzZXJfaWQiOjF9LCJpYXQiOjE3NTc1OTc5NTJ9.LWDmjzeT03mOuSk22wL41I4WcVgOu8ANAkkd71M6zsY"
          }, 
          body:JSON.stringify(
            {
            "appointment_start_time": new Date().getTime() + 3600*1000, 
            "preferredLanguage":"English", 
            "mode":"Pessimistic", 
            "appointment_end_time": new Date().getTime() + 10800 * 1000 ,
            "userCoordinates": { "lat": 4.332495, "lng": 101.1478746 },
            "clinicCoordinates": { "lat": 4.3293692, "lng": 101.1481781 },
            "requiresWheelchair": true,
            "top_k": 5
            }
          )
    }
)   

const recommendedRides = await response.text(); 
console.table(recommendedRides);

