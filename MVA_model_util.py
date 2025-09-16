# staff_scheduler.py

import numpy as np
import pandas as pd

# -------------------------------
# Configurable Weights
# -------------------------------
w_wait, w_workload, w_dist = 0.5, 0.4, 0.3

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
    waiting_time = abs(row['time_margin'] / 150)   # normalize
    avg_distance = ((row['distance_patient_clinic'] + row['distance_staff_patient']) / 2) / 15
    workload_term = row['workload'] / 10
    return w_wait * waiting_time + w_dist * avg_distance + w_workload * workload_term

def calculate_fitness(row):
    """Fitness score = base vars + language match bonus - cost."""
    num_vars = 3
    lang_bonus = check_language_match(row)
    cost = calculate_cost(row)
    return num_vars + lang_bonus - cost
