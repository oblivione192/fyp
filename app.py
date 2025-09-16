from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from joblib import load
from MVA_model_util import feature_cols, check_language_match, calculate_fitness

# -------------------------------
# Load trained model
# -------------------------------
model = load("mva_schedule_regressor.joblib")

# -------------------------------
# Define request schema
# -------------------------------
class ScheduleInput(BaseModel):  
    session_start_time: datetime
    session_end_time: datetime
    staff_id: int
    distance_patient_clinic:float
    distance_staff_patient:float
    language: str
    preferred_language: str 
    time_margin: float
    workload: int

class SchedulesRequest(BaseModel):
    schedules: List[ScheduleInput]
    top_n: int = 5 




# -------------------------------
# Initialize FastAPI
# -------------------------------
app = FastAPI()

@app.post("/recommend")
def recommend_schedules(req: SchedulesRequest):
    # Convert input to DataFrame
    df = pd.DataFrame([s.dict() for s in req.schedules])
    
    
    # Initialize dummy fitness_score for model input
    df['fitness_score'] = 0.0
    df['language_match'] = 0 

    df['language_match'] = df.apply(check_language_match,axis = 1) 
    
    # Predict final label
    df['fitness_score'] = model.predict(df[feature_cols])

    # Filter accepted & sort by fitness_score
    top_schedules = df.sort_values(by='fitness_score', ascending=False).head(req.top_n)

    return top_schedules.to_dict(orient='records')
