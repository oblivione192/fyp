// Node.js 18+ or with node-fetch installed
import fetch from "node-fetch";

async function getPrediction() {
  const input = {
    schedules: [
      // Positive / valid schedules
      { ride_id: 1, distance_patient_clinic: 5, preferred_language:"Mandarin", language:"Mandarin", distance_staff_patient: 3, time_margin: -2, workload: 4,  wheelchair: true },
      { ride_id: 2, distance_patient_clinic: 6, preferred_language:"Mandarin", language: "English", distance_staff_patient: 4, time_margin: -1, workload: 5,  wheelchair: true },
      { ride_id: 3, distance_patient_clinic: 4, preferred_language:"Mandarin",  language: "Malay", distance_staff_patient: 2, time_margin: 0, workload: 3,  wheelchair: true },
      { ride_id: 4, distance_patient_clinic: 7, preferred_language:"Mandarin",    language: "Mandarin", distance_staff_patient: 5, time_margin: -3, workload: 6,  wheelchair: true },
    ],
    top_n: 5
  };

  try {
    const response = await fetch("http://localhost:8000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      console.error("HTTP error:", response.status);
      return;
    }

    const result = await response.json();
    console.log("Accepted Schedules:");
    console.log(JSON.stringify(result, null, 2)); // pretty print
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

getPrediction();
