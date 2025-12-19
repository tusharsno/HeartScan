import { NextResponse } from "next/server";

/**
 * HeartScan Prediction API Route
 * Forwards prediction requests to the Python FastAPI backend
 */

// Get API URL from environment variables
// Falls back to localhost for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface PredictionRequest {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
}

interface PredictionResponse {
  prediction: string;
  probability: number;
  confidence: number;
  risk_level: string;
  timestamp: string;
}

export async function POST(req: Request) {
  try {
    const body: PredictionRequest = await req.json();

    // Validate required fields
    const requiredFields = [
      "age", "sex", "cp", "trestbps", "chol", "fbs",
      "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
    ];

    const missingFields = requiredFields.filter(field => !(field in body));
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    console.log(`[Prediction] Forwarding request to ${API_URL}/predict`);

    // Call Python FastAPI backend
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: "Backend service error"
      }));

      console.error("[Prediction] Backend error:", errorData);

      return NextResponse.json(
        {
          error: errorData.detail || errorData.error || "Prediction failed",
          status: response.status
        },
        { status: response.status }
      );
    }

    // Parse successful response
    const result: PredictionResponse = await response.json();

    console.log(`[Prediction] Success - Result: ${result.prediction}, Probability: ${result.probability}`);

    return NextResponse.json(result);

  } catch (err: any) {
    console.error("[Prediction] Server error:", err);

    // Check if it's a network error (API not reachable)
    if (err.cause?.code === "ECONNREFUSED") {
      return NextResponse.json(
        {
          error: "Backend API is not reachable. Please ensure the Python API is running.",
          details: `Could not connect to ${API_URL}`,
          suggestion: "Run: cd backend && uvicorn main:app --reload"
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: err.message
      },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint to verify API connectivity
 */
export async function GET() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: "unhealthy", message: "Backend API is not responding" },
        { status: 503 }
      );
    }

    const health = await response.json();

    return NextResponse.json({
      status: "healthy",
      backend: health,
      api_url: API_URL
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        message: "Cannot reach backend API",
        api_url: API_URL,
        error: err.message
      },
      { status: 503 }
    );
  }
}
