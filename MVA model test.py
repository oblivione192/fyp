# Corrected imports
import joblib
from joblib import load
import pandas as pd
import numpy as np
from sklearn.metrics import classification_report
from sklearn.preprocessing import LabelEncoder

# Load trained model
model = load('mva_schedule_model.joblib')

# -------------------------------
# 0. Setup encoders (must match training encoders)
# -------------------------------
# For production, you should persist encoders too, but here we'll refit them
staff_names = ['Ms. Tang', 'Ms. Kumar', 'Ms. Raychel', 'Ms. Aziz']
languages = ['English', 'Mandarin', 'Malay']

le_name = LabelEncoder().fit(staff_names)
le_lang = LabelEncoder().fit(languages)

# -------------------------------
# 1. Generate ground truth test data
# -------------------------------
n_samples = 1000

positive_data_ground = pd.DataFrame({
    'staff_name': np.random.choice(staff_names, n_samples),
    'distance_patient_clinic': np.random.uniform(1, 15, n_samples),  # km 
    'distance_staff_patient': np.random.uniform(1, 15, n_samples),   # km
    'time_margin': np.random.uniform(-150, 0, n_samples),            # minutes (neg = early)
    'workload': np.random.randint(1, 5, n_samples),                  # trips today
    'language': np.random.choice(languages, n_samples),
    'label': 1
})

negative_data_ground = pd.DataFrame({
   
    'staff_name': np.random.choice(staff_names, n_samples),
    'distance_patient_clinic': np.random.uniform(10, 100, n_samples),  # km 
    'distance_staff_patient': np.random.uniform(10, 100, n_samples),   # km
    'time_margin': np.random.uniform(1, 150, n_samples),               # minutes (late)
    'workload': np.random.randint(6, 12, n_samples),                   # trips today
    'language': np.random.choice(languages, n_samples),
    'label': 0
})

# -------------------------------
# 2. Apply cost/fitness score
# -------------------------------
w_wait, w_workload, w_dist = 0.5, 0.4, 0.3

def calculate_cost(row):
    waiting_time = abs(row['time_margin'] / 150)   # normalize
    avg_distance = ((row['distance_patient_clinic'] + row['distance_staff_patient']) / 2) / 15
    workload_term = row['workload'] / 10
    return w_wait * waiting_time + w_dist * avg_distance + w_workload * workload_term

num_vars = 3
for df in [positive_data_ground, negative_data_ground]:
    df['cost'] = df.apply(calculate_cost, axis=1)
    df['fitness_score'] = df['cost'].apply(lambda c: num_vars - c)
    df.drop(columns=['cost'], inplace=True)

# -------------------------------
# 3. Encode categorical features
# -------------------------------
for df in [positive_data_ground, negative_data_ground]:
    df['staff_name'] = le_name.transform(df['staff_name'])
    df['language'] = le_lang.transform(df['language'])

# -------------------------------
# 4. Prepare data for prediction
# -------------------------------
X_test = pd.concat([
    positive_data_ground.drop(columns=['label']),
    negative_data_ground.drop(columns=['label'])
], ignore_index=True)

y_test = pd.concat([
    positive_data_ground['label'],
    negative_data_ground['label']
], ignore_index=True)

# -------------------------------
# 5. Make predictions
# -------------------------------
y_pred = model.predict(X_test)

approved_schedules = X_test[y_pred == 1].copy()
approved_schedules['predicted_label'] = 1

feature_cols = X_test.columns  # should match training features
proba = model.predict_proba(approved_schedules[feature_cols])

# Probability of "accept" class (class 1)
approved_schedules['accept_proba'] = proba[:, 1]

# Save approved schedules
approved_schedules.to_csv("approved_schedules.csv", index=False)

# -------------------------------
# 6. Evaluate performance
# -------------------------------
print(classification_report(y_test, y_pred))
