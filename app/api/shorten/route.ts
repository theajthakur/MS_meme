import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Make sure we have a URL to shorten
    if (!body.url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || "https://fastapi-url-shortener-a6zc.onrender.com";
    
    // Call the FastAPI backend POST /short/
    const response = await fetch(`${backendUrl}/short/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: body.url }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Backend server error";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.detail || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to connect to backend service" },
      { status: 500 }
    );
  }
}
