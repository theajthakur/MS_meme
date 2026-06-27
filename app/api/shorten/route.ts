import { NextResponse } from "next/server";
import { shortenUrl, checkHealth } from "../../../lib/shortener";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request parameter
    if (!body.url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Call Axios client wrapper
    const data = await shortenUrl(body.url);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Proxy API POST] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to connect to backend service" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Call Axios client wrapper health check
    const data = await checkHealth();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Proxy API GET] Health check error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to ping backend service" },
      { status: 500 }
    );
  }
}
