from fastapi import FastAPI
from pydantic import BaseModel, Extra
from typing import List
import pandas as pd
from joblib import load
from MVA_model_util import feature_cols, check_language_match

# -------------------------------
# Load trained model
# -------------------------------
model = load("mva_schedule_regressor.joblib")

# -------------------------------
# Define request schema
# -------------------------------
class ScheduleInput(BaseModel):
    distance_patient_clinic: float
    distance_staff_patient: float
    language: str
    preferred_language: str
    time_margin: float
    workload: int 
    class Config:
        extra = Extra.allow

class SchedulesRequest(BaseModel):
    schedules: List[ScheduleInput]
    top_n: int = 5

# -------------------------------
# Initialize FastAPI
# -------------------------------
app = FastAPI()

@app.post("/recommend")
def recommend_schedules(req: SchedulesRequest):
    # Keep original objects
    original_objs = [s.dict() for s in req.schedules]
    

    # Make a DataFrame of only attributes for model
    df = pd.DataFrame(original_objs)

    # Add derived fields needed for prediction
    df['language_match'] = df.apply(check_language_match, axis=1)

    # Predict fitness score
    df['fitness_score'] = model.predict(df[feature_cols])

    # Sort by fitness_score
    df_sorted = df.sort_values(by='fitness_score', ascending=False).head(req.top_n)

    # Merge back the fitness_score to original objects in sorted order
    results = []
    for idx in df_sorted.index:
        obj = original_objs[idx].copy()
        obj['fitness_score'] = float(df_sorted.loc[idx, 'fitness_score'])
        results.append(obj)

    return results
