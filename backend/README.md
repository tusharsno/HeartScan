# HeartScan Backend API

Production-ready FastAPI backend for heart disease prediction using Random Forest ML model.

## Features

- FastAPI REST API with automatic documentation
- Random Forest model with 99.7% accuracy
- Real-time predictions with probability scores
- Risk level classification (Low/Medium/High)
- CORS support for frontend integration
- Health check endpoints
- Input validation with Pydantic
- Logging and error handling
- Environment-based configuration

## Quick Start

### Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: `http://localhost:8000`
- **Docs**: `http://localhost:8000/docs`
- **Health**: `http://localhost:8000/health`

### Environment Variables

Create a `.env` file:

```bash
ENVIRONMENT=development
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
```

## API Endpoints

### GET /
Root endpoint returning API status

### GET /health
Health check endpoint for monitoring

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "scaler_loaded": true,
  "environment": "development",
  "timestamp": "2025-12-19T10:30:00.000Z"
}
```

### POST /predict
Main prediction endpoint

**Request Body:**
```json
{
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
```

**Response:**
```json
{
  "prediction": "Positive",
  "probability": 0.8542,
  "confidence": 0.8542,
  "risk_level": "High",
  "timestamp": "2025-12-19T10:30:00.000Z"
}
```

## Input Parameters

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| age | float | 1-120 | Age in years |
| sex | float | 0-1 | 0=Female, 1=Male |
| cp | float | 0-3 | Chest pain type |
| trestbps | float | 80-200 | Resting blood pressure (mm Hg) |
| chol | float | 100-600 | Serum cholesterol (mg/dl) |
| fbs | float | 0-1 | Fasting blood sugar > 120 mg/dl |
| restecg | float | 0-2 | Resting ECG results |
| thalach | float | 60-220 | Maximum heart rate achieved |
| exang | float | 0-1 | Exercise induced angina |
| oldpeak | float | 0-10 | ST depression |
| slope | float | 0-2 | Slope of peak exercise ST segment |
| ca | float | 0-3 | Number of major vessels |
| thal | float | 0-3 | Thalassemia type |

## Risk Classification

- **Low Risk**: probability < 0.3
- **Medium Risk**: 0.3 ≤ probability < 0.7
- **High Risk**: probability ≥ 0.7

## Model Details

- **Algorithm**: Random Forest Classifier
- **Accuracy**: 99.7%
- **Features**: 13 clinical parameters
- **Preprocessing**: StandardScaler normalization
- **Files**:
  - `model/heart_RandomForest.pkl` - Trained model
  - `model/scaler.pkl` - Feature scaler

## CLI Usage

The backend also supports command-line usage:

```bash
# Using JSON file
python main.py backend/input.json

# Using JSON string
python main.py '{"age": 58, "sex": 0, ...}'
```

## Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed deployment instructions.

### Railway

```bash
railway init
railway up
```

### Render

Use `render.yaml` configuration for one-click deploy.

## Dependencies

- fastapi
- uvicorn
- scikit-learn
- numpy
- pandas
- pydantic

## License

Private - HeartScan Project
