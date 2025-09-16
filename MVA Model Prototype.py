from joblib import dump
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeRegressor
from MVA_model_util import feature_cols, calculate_fitness, check_language_match

# -------------------------------
# 1. Simulate Schedule Data
# -------------------------------
n_samples = 1000  # number of samples

# Only keep language options (no staff list)
languages = ["Mandarin", "English", "Malay"]

# Build DataFrame
train_data = pd.DataFrame({
    'distance_patient_clinic': np.random.uniform(1, 15, n_samples),  # km 
    'distance_staff_patient': np.random.uniform(1, 15, n_samples),   # km
    'time_margin': np.random.uniform(-30, 0, n_samples),             # minutes (neg = early)
    'workload': np.random.randint(1, 5, n_samples),                  # trips today
})

# Assign languages (50% match / 50% random)
mask = np.random.rand(n_samples) < 0.5
train_data['language'] = np.random.choice(languages, n_samples)

# Add a "preferred_language" column (user request)
train_data['preferred_language'] = np.random.choice(languages, n_samples)

# -------------------------------
# Cost Function & Fitness Score
# -------------------------------
train_data['fitness_score'] = train_data.apply(calculate_fitness, axis=1)

# -------------------------------
# Encode language_match
# -------------------------------
train_data['language_match'] = (train_data['language'] == train_data['preferred_language']).astype(int)

# Drop non-feature cols if necessary
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

print("Model and encoders saved successfully.")
