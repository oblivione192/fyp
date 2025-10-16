from joblib import dump
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeRegressor
from MVA_model_util import feature_cols, calculate_fitness, check_language_match

# -------------------------------
# 1. Simulate Schedule Data
# -------------------------------
n_samples = 3000  # number of samples

languages = ["Mandarin", "English", "Malay"]

# -------------------------------
# Generate base features
# -------------------------------
train_data = pd.DataFrame({
    'distance_patient_clinic': np.random.uniform(1, 15, n_samples),   # km
    'distance_staff_patient': np.random.uniform(1, 15, n_samples),    # km
    'time_margin': np.random.uniform(-30, 0, n_samples),             # minutes (can be early or late)
    'workload': np.random.randint(6, 8, n_samples),                   # allow some workloads >5
})

# -------------------------------
# Add languages
# -------------------------------
train_data['language'] = np.random.choice(languages, n_samples)
train_data['preferred_language'] = np.random.choice(languages, n_samples)

# -------------------------------
# Bias the data to include penalties
# -------------------------------
# 40% cases with lateness > 0 (penalty)
late_mask = np.random.rand(n_samples) < 0.4
train_data.loc[late_mask, 'time_margin'] = np.random.uniform(5, 30, late_mask.sum())

# 30% cases with long distances (penalty)
dist_mask = np.random.rand(n_samples) < 0.3
train_data.loc[dist_mask, 'distance_patient_clinic'] = np.random.uniform(20, 40, dist_mask.sum())
train_data.loc[dist_mask, 'distance_staff_patient'] = np.random.uniform(25, 30, dist_mask.sum())

# 25% cases with overload workload (penalty)
work_mask = np.random.rand(n_samples) < 0.25
train_data.loc[work_mask, 'workload'] = np.random.randint(6, 10, work_mask.sum())

# -------------------------------
# Cost Function & Fitness Score
# -------------------------------
train_data['fitness_score'] = train_data.apply(calculate_fitness, axis=1)

# -------------------------------
# Encode language_match
# -------------------------------
train_data['language_match'] = (
    train_data['language'] == train_data['preferred_language']
).astype(int)

# Features & labels
X = train_data[feature_cols]
y = train_data['fitness_score']

# -------------------------------
# Train Decision Tree Regressor
# -------------------------------
reg = DecisionTreeRegressor(max_depth=8, random_state=42)
reg.fit(X, y)

# Save model
dump(reg, 'mva_schedule_regressor.joblib')

# Save initial data for debugging
train_data.to_csv("Initial_Training_Data.csv", index=False)

print("Model trained and saved with penalty-heavy training data.")
