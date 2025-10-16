
import numpy as np
import pandas as pd

# -------------------------------
# Configurable Weights
# ------------------------------- 

#cost function weights
w_wait, w_workload, w_dist = 0.5, 0.4, 0.3
#penalty function weights 
alpha_lateness, betta_dist, gamma_workload = 0.95, 0.25, 0.15
#max tolerance for lateness, distance exceeded and workload exceeded
max_tolerable_lateness, max_tolerable_distance_exceeded, max_tolerable_workload_exceeded = 30, 45, 4
#thresholds for distance and workload
TOTAL_DISTANCE_THRESH = 30 
TOTAL_WORKLOAD_THRESH = 5 

max_waiting_time = 150 
avg_distance_threshold = 15 
workload_threshold = 4
# -------------------------------
# Feature Columns
# -------------------------------
feature_cols = [
    "distance_patient_clinic",
    "distance_staff_patient",
    "time_margin",
    "workload",
    "language_match"
]

# -------------------------------
# Utility Functions
# -------------------------------
def check_language_match(row):
    """Return 1 if staff speaks patient's language, else 0."""
    return int(
        (row['preferred_language'] == row['language'])  
    )

def calculate_cost(row):
    """Weighted cost function based on waiting time, distance, and workload."""
    waiting_time = abs(row['time_margin'] / max_waiting_time)   # normalize
    avg_distance = (row['distance_patient_clinic'] + row['distance_staff_patient']) / TOTAL_DISTANCE_THRESH
    workload_term = row['workload'] / TOTAL_WORKLOAD_THRESH
    return w_wait * waiting_time + w_dist * avg_distance + w_workload * workload_term


def calculate_penalty(row):
    return (
          (alpha_lateness * max(0,(row['time_margin'] / max_tolerable_lateness)))
        + (betta_dist * (max(0,(row['distance_patient_clinic'] + row['distance_staff_patient'] - TOTAL_DISTANCE_THRESH) / max_tolerable_distance_exceeded)))
        + (gamma_workload * (max(0,(row['workload'] - TOTAL_WORKLOAD_THRESH) / max_tolerable_workload_exceeded))
        )
    )


def calculate_fitness(row): 
    """Fitness score = base vars + language match bonus - cost."""
    num_vars = 3
    lang_bonus = check_language_match(row)
    cost = calculate_cost(row) 
    penalty = calculate_penalty(row)
    return num_vars + lang_bonus - (cost + penalty) 
