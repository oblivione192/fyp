import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.preprocessing import LabelEncoder
from joblib import dump
import json

# -------------------------------
# 1. Simulate Schedule Data
# -------------------------------
np.random.seed(42)
n_samples = 300

train_data = pd.DataFrame({
    'staff_name': np.random.choice(['Ms. Tang', 'Ms. Kumar', 'Ms. Raychel', 'Ms. Aziz'], n_samples),
    'distance_patient_clinic': np.random.uniform(1, 20, n_samples),  # km 
    'distance_staff_patient': np.random.uniform(1, 20, n_samples),   # km
    'time_margin': np.random.uniform(-30, 15, n_samples),            # minutes (neg = early)
    'workload': np.random.randint(1, 10, n_samples),                  # trips today
    'language': np.random.choice(['English', 'Mandarin', 'Malay'], n_samples),
    'wheelchair': np.random.choice([True, False], n_samples)
})

# -------------------------------
# Cost Function 
# -------------------------------
w_wait, w_workload, w_dist = 0.5, 0.4, 0.3

def calculate_cost(row):
    waiting_time = abs(row['time_margin'] / 150)   # normalize
    avg_distance = ((row['distance_patient_clinic'] + row['distance_staff_patient']) / 2) / 15
    workload_term = row['workload'] / 10
    return w_wait * waiting_time + w_dist * avg_distance + w_workload * workload_term

num_vars = 3  # waiting_time, distance, workload
train_data['cost'] = train_data.apply(calculate_cost, axis=1)
train_data['fitness_score'] = train_data['cost'].apply(lambda c: num_vars - c)
train_data.drop(columns=['cost'],inplace=True) 
# -------------------------------
# 2. Label positive and negative cases
# -------------------------------
train_data['label'] = (
    (train_data['time_margin'] <= 0) & (train_data['time_margin'] >= -150) &
    (train_data['distance_patient_clinic'] <= 15) &
    (train_data['distance_staff_patient'] <= 15) &
    (train_data['workload'] <= 5)
).astype(int)

train_data.to_csv('Initial Training Data.csv', index=False)

# -------------------------------
# Encode categorical features
# -------------------------------
le_name = LabelEncoder()
le_lang = LabelEncoder()

train_data['staff_name'] = le_name.fit_transform(train_data['staff_name'])
train_data['language'] = le_lang.fit_transform(train_data['language'])

# -------------------------------
# Train Decision Tree Classifier
# -------------------------------
X_train = train_data.drop(columns=["wheelchair", "label"])  # exclude non-features
y_train = train_data['label']

clf = DecisionTreeClassifier(max_depth=4, random_state=42)
clf.fit(X_train, y_train)

# Save model
dump(clf, 'mva_schedule_model.joblib')
