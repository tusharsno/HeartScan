import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

// Python স্ক্রিপ্টের পাথ ঠিক করো
const MODEL_SCRIPT = path.resolve("./backend/main.py");

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Python স্ক্রিপ্ট চালাও
    const pythonProcess = spawn("python", [MODEL_SCRIPT, JSON.stringify(body)]);

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    const exitCode: number = await new Promise((resolve) => {
      pythonProcess.on("close", resolve);
    });

    if (exitCode !== 0) {
      console.error("Python error:", errorOutput);
      return NextResponse.json(
        { error: "Prediction script failed", details: errorOutput },
        { status: 500 }
      );
    }

    const result = JSON.parse(output);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
