from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import pandas as pd
from joblib import load

# -------------------------------
# Load trained model
# -------------------------------
model = load("mva_schedule_model.joblib")

# -------------------------------
# Define request schema
# -------------------------------
class ScheduleInput(BaseModel):
    distance_patient_clinic: float
    distance_staff_patient: float
    time_margin: float
    workload: int
    language: str = "English"
    wheelchair: bool = False

class SchedulesRequest(BaseModel):
    schedules: List[ScheduleInput]
    top_n: int = 5

# -------------------------------
# Hard constraint filter
# -------------------------------
def apply_hard_constraints(df, user_language=None, needs_wheelchair=False):
    df = df[df['time_margin'] <= 0]  # must be punctual or early
    if user_language:
        df = df[df['language'] == user_language]
    if needs_wheelchair:
        df = df[df['wheelchair'] == True]
    return df

# -------------------------------
# Cost & Fitness Calculation
# -------------------------------
w_dist, w_time, w_workload = 0.3, 0.5, 0.4
num_vars = 4  # waiting_time, distance, workload, confidence

def calculate_cost(row):
    dist_term = row['distance_patient_clinic'] / 15
    time_term = abs(row['time_margin']) / 15
    workload_term = row['workload'] / 10
    return w_dist * dist_term + w_time * time_term + w_workload * workload_term

def calculate_fitness(cost):
    return num_vars - cost

# -------------------------------
# Initialize FastAPI
# -------------------------------
app = FastAPI()

@app.post("/recommend")
def recommend_schedules(req: SchedulesRequest):
    # Convert input to DataFrame
    df = pd.DataFrame([s.dict() for s in req.schedules])

    # Apply hard constraints first
    df = apply_hard_constraints(df, user_language="English", needs_wheelchair=True)
    if df.empty:
        return {"message": "No schedules satisfy hard constraints."}

    # Initialize dummy fitness_score for model input
    df['fitness_score'] = 0.0

    # Predict accept probability using trained DTC
    feature_cols = ['distance_patient_clinic', 'distance_staff_patient', 'time_margin', 'workload', 'fitness_score']
    df['accept_prob'] = model.predict_proba(df[feature_cols])[:, 1]

    # Recalculate cost & fitness for ranking
    df['cost'] = df.apply(calculate_cost, axis=1)
    df['fitness_score'] = df['cost'].apply(calculate_fitness)

    # Predict final label
    df['predicted_label'] = model.predict(df[feature_cols])

    # Filter accepted & sort by fitness_score
    accepted = df[df['predicted_label'] == 1].copy()
    top_schedules = accepted.sort_values(by='fitness_score', ascending=False).head(req.top_n)

    return top_schedules.to_dict(orient='records')
