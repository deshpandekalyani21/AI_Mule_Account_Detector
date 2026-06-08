import joblib
import pandas as pd

# Load model
model = joblib.load("../Model/mule_account_detector.pkl")

# Load dataset
df = pd.read_csv("../Datasets/selected_features_dataset.csv")

# Separate features
X = df.drop("F3924", axis=1)

# Take one sample
sample = X.iloc[[0]]

# Prediction
prediction = model.predict(sample)
probability = model.predict_proba(sample)

print("Prediction:", prediction)
print("Probability:", probability)