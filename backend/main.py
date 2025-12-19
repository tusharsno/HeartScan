"""
HeartScan - Heart Disease Prediction API
Production-ready FastAPI backend with model inference
"""

import warnings
warnings.filterwarnings("ignore")

import json
import sys
import os
import logging
from typing import Dict, Optional
from datetime import datetime

import numpy as np
import pickle
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator

# ===== Logging Configuration =====
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ===== Environment Configuration =====
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://heartscan.vercel.app"
).split(",")

# ===== Model Loading =====
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")

try:
    with open(os.path.join(MODEL_DIR, "heart_RandomForest.pkl"), "rb") as f:
        model = pickle.load(f)
    with open(os.path.join(MODEL_DIR, "scaler.pkl"), "rb") as f:
        scaler = pickle.load(f)
    logger.info("✅ Model and scaler loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load model: {e}")
    raise


# ===== Pydantic Models for Validation =====
class HeartDiseaseInput(BaseModel):
    """Input schema for heart disease prediction"""
    age: float = Field(..., ge=1, le=120, description="Age in years")
    sex: float = Field(..., ge=0, le=1, description="Sex (0=Female, 1=Male)")
    cp: float = Field(..., ge=0, le=3, description="Chest pain type (0-3)")
    trestbps: float = Field(..., ge=80, le=200, description="Resting blood pressure (mm Hg)")
    chol: float = Field(..., ge=100, le=600, description="Serum cholesterol (mg/dl)")
    fbs: float = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dl (0/1)")
    restecg: float = Field(..., ge=0, le=2, description="Resting ECG results (0-2)")
    thalach: float = Field(..., ge=60, le=220, description="Maximum heart rate achieved")
    exang: float = Field(..., ge=0, le=1, description="Exercise induced angina (0/1)")
    oldpeak: float = Field(..., ge=0, le=10, description="ST depression induced by exercise")
    slope: float = Field(..., ge=0, le=2, description="Slope of peak exercise ST segment (0-2)")
    ca: float = Field(..., ge=0, le=3, description="Number of major vessels (0-3)")
    thal: float = Field(..., ge=0, le=3, description="Thalassemia (0=normal, 1=fixed, 2=reversible, 3=unknown)")

    class Config:
        json_schema_extra = {
            "example": {
                "age": 58,
                "sex": 0,
                "cp": 0,
                "trestbps": 100,
                "chol": 248,
                "fbs": 0,
                "restecg": 0,
                "thalach": 122,
                "exang": 0,
                "oldpeak": 1.0,
                "slope": 1,
                "ca": 0,
                "thal": 2
            }
        }


class PredictionResponse(BaseModel):
    """Response schema for prediction"""
    prediction: str = Field(..., description="Prediction result (Positive/Negative)")
    probability: float = Field(..., ge=0, le=1, description="Probability of heart disease (0-1)")
    confidence: float = Field(..., ge=0, le=1, description="Model confidence score")
    risk_level: str = Field(..., description="Risk level (Low/Medium/High)")
    timestamp: str = Field(..., description="Prediction timestamp")


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    model_loaded: bool
    scaler_loaded: bool
    environment: str
    timestamp: str


# ===== Core Prediction Function =====
def predict_heart_disease(data: Dict) -> Dict:
    """
    Perform heart disease prediction with probability scores

    Args:
        data: Dictionary with 13 features

    Returns:
        Dictionary with prediction, probability, and risk assessment
    """
    try:
        # Convert input to numpy array (ensure correct order)
        input_array = np.array([[
            data.get("age", 0),
            data.get("sex", 0),
            data.get("cp", 0),
            data.get("trestbps", 0),
            data.get("chol", 0),
            data.get("fbs", 0),
            data.get("restecg", 0),
            data.get("thalach", 0),
            data.get("exang", 0),
            data.get("oldpeak", 0),
            data.get("slope", 0),
            data.get("ca", 0),
            data.get("thal", 0)
        ]])

        # Scale features
        scaled_data = scaler.transform(input_array)

        # Get prediction and probability
        prediction = model.predict(scaled_data)[0]
        probabilities = model.predict_proba(scaled_data)[0]

        # Calculate risk metrics
        disease_probability = float(probabilities[1])  # Probability of class 1 (disease)
        confidence = float(max(probabilities))

        # Determine risk level
        if disease_probability < 0.3:
            risk_level = "Low"
        elif disease_probability < 0.7:
            risk_level = "Medium"
        else:
            risk_level = "High"

        result = "Positive" if prediction == 1 else "Negative"

        logger.info(f"Prediction: {result}, Probability: {disease_probability:.2f}, Risk: {risk_level}")

        return {
            "prediction": result,
            "probability": round(disease_probability, 4),
            "confidence": round(confidence, 4),
            "risk_level": risk_level,
            "timestamp": datetime.utcnow().isoformat()
        }

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise


# ===== FastAPI Application =====
app = FastAPI(
    title="HeartScan API",
    description="AI-powered heart disease prediction using Random Forest",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ENVIRONMENT == "production" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===== API Endpoints =====
@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint - API status"""
    return {
        "message": "HeartScan API is running",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
        "environment": ENVIRONMENT,
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict_endpoint(data: HeartDiseaseInput):
    """
    Predict heart disease risk based on patient data

    - **Returns**: Prediction result with probability and risk assessment
    """
    try:
        # Convert Pydantic model to dict
        input_data = data.model_dump()

        # Perform prediction
        result = predict_heart_disease(input_data)

        return result

    except Exception as e:
        logger.error(f"Prediction endpoint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )


# ===== CLI Interface (for subprocess compatibility) =====
if __name__ == "__main__":
    # Check if running as CLI (for Next.js subprocess calls)
    if len(sys.argv) > 1:
        try:
            # Parse input from command line argument
            if os.path.isfile(sys.argv[1]):
                with open(sys.argv[1], "r") as f:
                    data = json.load(f)
            else:
                data = json.loads(sys.argv[1])

            # Perform prediction
            result = predict_heart_disease(data)
            print(json.dumps(result))

        except Exception as e:
            print(json.dumps({"error": str(e)}))
            sys.exit(1)
    else:
        # Run FastAPI server
        import uvicorn
        port = int(os.getenv("PORT", 8000))
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=port,
            reload=ENVIRONMENT == "development"
        )
