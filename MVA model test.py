# Corrected imports
import joblib
from joblib import load
import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
from MVA_model_util import calculate_fitness, check_language_match, feature_cols
# Load trained regressor
model = load('mva_schedule_regressor.joblib')


# -------------------------------
# 1. Generate candidate schedules
# -------------------------------
n_samples = 50


languages = ['English', 'Mandarin', 'Malay']  # possible patient languages



# Random language assignment (so mismatches appear)
rand_languages = np.random.choice(languages, n_samples)

# Create the DataFrame
test_data = pd.DataFrame({
    'language': rand_languages,   # random language (may mismatch staff)
    'preferred_language': rand_languages, 
    'distance_patient_clinic': np.random.uniform(25, 30, n_samples),  # km 
    'distance_staff_patient': np.random.uniform(10, 25, n_samples),   # km
    'time_margin': np.random.uniform(5, 30, n_samples),            # minutes (neg = early)
    'workload': np.random.randint(5, 8, n_samples),                 # trips today
})


test_data['true_fitness'] = test_data.apply(calculate_fitness, axis=1)

# -------------------------------
# 3. Encode categorical features
# -------------------------------
test_data['language_match'] = test_data.apply(check_language_match, axis = 1)


# -------------------------------
# 4. Predict with the regressor
# -------------------------------
X_test = test_data[feature_cols]
y_pred = model.predict(X_test)
test_data['predicted_fitness'] = y_pred
# -------------------------------
# 5. Rank schedules by predicted fitness
# -------------------------------
best_schedules = test_data.sort_values(by="predicted_fitness", ascending=False)

# Save ranked schedules
best_schedules.to_csv("ranked_schedules.csv", index=False)

# -------------------------------
# 6. Evaluate regression accuracy
# -------------------------------
mae = mean_absolute_error(test_data['true_fitness'], test_data['predicted_fitness'])
mse = mean_squared_error(test_data['true_fitness'], test_data['predicted_fitness'])
r2 = r2_score(test_data['true_fitness'], test_data['predicted_fitness'])

print("Regression Performance:")
print(f"MAE: {mae:.4f}")
print(f"MSE: {mse:.4f}")
print(f"R²: {r2:.4f}")

print("\nTop 5 Recommended Schedules (Predicted Fitness):")
print(best_schedules.head(5))

from sklearn import tree
import matplotlib.pyplot as plt

# -------------------------------
# 7. Visualize Decision Tree Splits
# -------------------------------
plt.figure(figsize=(24, 12))
tree.plot_tree(
    model,
    feature_names=X_test.columns,
    filled=True,
    rounded=True,
    fontsize=9
)

plt.title("Decision Tree Splits for Schedule Fitness Prediction", fontsize=16, fontweight="bold")
plt.show()

# Save as PNG
plt.savefig("decision_tree_splits.png", dpi=300, bbox_inches="tight")
plt.close()

print("Decision tree diagram saved as 'decision_tree_splits.png'")
