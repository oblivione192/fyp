// Node.js 18+ or with node-fetch installed
import fetch from "node-fetch";

async function getPrediction() {
  const input = {
    schedules: [
      // Positive / valid schedules
      { distance_patient_clinic: 5, distance_staff_patient: 3, time_margin: 2, workload: 4, language: "English", wheelchair: true },
      { distance_patient_clinic: 6, distance_staff_patient: 4, time_margin: -1, workload: 5, language: "English", wheelchair: true },
      { distance_patient_clinic: 4, distance_staff_patient: 2, time_margin: 0, workload: 3, language: "English", wheelchair: true },
      { distance_patient_clinic: 7, distance_staff_patient: 5, time_margin: 3, workload: 6, language: "English", wheelchair: true },
      
      // Negative schedules
      { distance_patient_clinic: 12, distance_staff_patient: 8, time_margin: 12, workload: 9, language: "English", wheelchair: true },
      { distance_patient_clinic: 13, distance_staff_patient: 9, time_margin: -10, workload: 10, language: "English", wheelchair: false },
      { distance_patient_clinic: 14, distance_staff_patient: 7, time_margin: 15, workload: 9, language: "Mandarin", wheelchair: false },
      { distance_patient_clinic: 11, distance_staff_patient: 6, time_margin: -12, workload: 8, language: "Malay", wheelchair: true },

      // Another positive schedule
      { distance_patient_clinic: 3, distance_staff_patient: 1, time_margin: -2, workload: 2, language: "English", wheelchair: true },
      { distance_patient_clinic: 5, distance_staff_patient: 2, time_margin: 1, workload: 3, language: "English", wheelchair: true }
    ],
    top_n: 10
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
