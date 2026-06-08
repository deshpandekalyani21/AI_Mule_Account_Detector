from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
import io

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and selected features
model = joblib.load("../Model/mule_account_detector.pkl")
selected_features = joblib.load("../Model/selected_features.pkl")

@app.get("/")
def home():
    return {"message": "AI Mule Account Detector API Running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))

    # Keep only features used during training
    df = df[selected_features]

    predictions = model.predict(df)
    probabilities = model.predict_proba(df)[:, 1]

    results = []

    for pred, prob in zip(predictions, probabilities):
        results.append({
            "prediction": int(pred),
            "status": "Mule Account Detected" if pred == 1 else "Legitimate Account",
            "risk_score": round(float(prob), 4)
        })

    return results