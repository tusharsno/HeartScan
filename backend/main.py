# from fastapi import FastAPI
# from pydantic import BaseModel
# import pickle
# import numpy as np
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# # CORS (Next.js থেকে API call করতে)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # মডেল লোড
# model = pickle.load(open("model/heart_RandomForest.pkl", "rb"))
# scaler = pickle.load(open("model/scaler.pkl", "rb"))

# # ইনপুট ডেটা ক্লাস
# class InputData(BaseModel):
#     age: float
#     sex: float
#     cp: float
#     trestbps: float
#     chol: float
#     fbs: float
#     restecg: float
#     thalach: float
#     exang: float
#     oldpeak: float
#     slope: float
#     ca: float
#     thal: float

# @app.post("/predict")
# def predict(data: InputData):
#     # ইনপুট ডেটাকে numpy array এ কনভার্ট করা
#     features = np.array([[data.age, data.sex, data.cp, data.trestbps, data.chol, 
#                           data.fbs, data.restecg, data.thalach, data.exang, 
#                           data.oldpeak, data.slope, data.ca, data.thal]])
    
#     scaled = scaler.transform(features)
#     prediction = model.predict(scaled)
#     result = "Heart Disease Detected" if prediction[0] == 1 else "No Heart Disease"
#     return {"prediction": result}



# from fastapi import FastAPI
# from pydantic import BaseModel
# import pickle
# import numpy as np
# import os
# from fastapi.middleware.cors import CORSMiddleware

# # FastAPI app initialization
# app = FastAPI()

# # Enable CORS (for Next.js frontend access)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # You can restrict to ["http://localhost:3000"] if needed
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Get model directory path
# MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")

# # Load model and scaler
# with open(os.path.join(MODEL_DIR, "heart_RandomForest.pkl"), "rb") as f:
#     model = pickle.load(f)

# with open(os.path.join(MODEL_DIR, "scaler.pkl"), "rb") as f:
#     scaler = pickle.load(f)

# # Input data schema
# class InputData(BaseModel):
#     age: float
#     sex: float
#     cp: float
#     trestbps: float
#     chol: float
#     fbs: float
#     restecg: float
#     thalach: float
#     exang: float
#     oldpeak: float
#     slope: float
#     ca: float
#     thal: float

# @app.get("/")
# def root():
#     return {"message": "Heart Disease Prediction API is running!"}

# @app.post("/predict")
# def predict(data: InputData):
#     # Convert input to numpy array
#     features = np.array([[data.age, data.sex, data.cp, data.trestbps, data.chol,
#                           data.fbs, data.restecg, data.thalach, data.exang,
#                           data.oldpeak, data.slope, data.ca, data.thal]])

#     # Scale input
#     scaled = scaler.transform(features)

#     # Predict
#     prediction = model.predict(scaled)
#     result = "Heart Disease Detected ❤️" if prediction[0] == 1 else "No Heart Disease 💚"

#     return {"prediction": result}




import warnings
warnings.filterwarnings("ignore")

import json
import sys
import os
import numpy as np
import pickle

# === Model path সেট করা ===
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")

with open(os.path.join(MODEL_DIR, "heart_RandomForest.pkl"), "rb") as f:
    model = pickle.load(f)

with open(os.path.join(MODEL_DIR, "scaler.pkl"), "rb") as f:
    scaler = pickle.load(f)


def predict_heart_disease(data):
    """
    data = dictionary যেমন:
    {
      "age": 45,
      "sex": 1,
      "cp": 0,
      "trestbps": 130,
      "chol": 250,
      "fbs": 0,
      "restecg": 1,
      "thalach": 150,
      "exang": 0,
      "oldpeak": 1.2,
      "slope": 2,
      "ca": 0,
      "thal": 2
    }
    """
    input_data = np.array(list(data.values())).reshape(1, -1)
    scaled_data = scaler.transform(input_data)
    prediction = model.predict(scaled_data)
    result = "Positive" if prediction[0] == 1 else "Negative"
    return {"prediction": result}


# === যদি এই ফাইলটা সরাসরি Next.js থেকে রান হয় ===
if __name__ == "__main__":
    try:
        # যদি JSON argument হিসেবে আসে (Next.js থেকে)
        if len(sys.argv) > 1:
            # যদি ফাইল দেওয়া হয়
            if os.path.isfile(sys.argv[1]):
                with open(sys.argv[1], "r") as f:
                    data = json.load(f)
            else:
                # না হলে সরাসরি JSON string
                data = json.loads(sys.argv[1])
        else:
            print(json.dumps({"error": "No input data received"}))
            sys.exit(0)

        result = predict_heart_disease(data)
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))



# === FastAPI দিয়ে API endpoint তৈরি ===
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# --- CORS (frontend থেকে request allow করার জন্য) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # তুমি চাইলে frontend এর URL দিতে পারো যেমন "http://localhost:3000"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Heart Disease Prediction API is running 🚀"}

@app.post("/predict")
def predict_api(data: dict):
    try:
        result = predict_heart_disease(data)
        return result
    except Exception as e:
        return {"error": str(e)}


# দারুন 🎯 — একদম ঠিকভাবে কোডটা সাজানো হয়েছে এখন!

# তোমার main.py এখন দুইভাবে কাজ করবে 👇
# ✅ ১️⃣ — সরাসরি কমান্ড লাইন থেকে (যেমন: python main.py input.json)
# ✅ ২️⃣ — আবার API সার্ভার হিসেবেও (FastAPI দিয়ে)