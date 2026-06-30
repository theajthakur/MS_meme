import api from "./api";

export interface ShortenResponse {
  message: string;
  short_code: string;
  original_url: string;
}

export interface HealthResponse {
  message: string;
}

/**
 * Health / test check endpoint
 * GET /short/
 */
export async function checkHealth(): Promise<HealthResponse> {
  try {
    const response = await api.get<HealthResponse>("/short/");
    return response.data;
  } catch (error: any) {
    console.error("[Shortener API] Health check failed:", error.message);
    throw error;
  }
}

/**
 * Create a short URL
 * POST /short/
 * Request body: { "url": "https://example.com" }
 */
export async function shortenUrl(originalUrl: string): Promise<ShortenResponse> {
  try {
    const response = await api.post<ShortenResponse>("/short/", {
      url: originalUrl,
    });

    // Check if the API returned an invalid URL message explicitly
    if (response.data && response.data.message === "Invalid url") {
      throw new Error("Invalid URL: The backend rejected this address format.");
    }

    return response.data;
  } catch (error: any) {
    // If it's already our thrown "Invalid URL" error, rethrow it directly
    if (error.message.startsWith("Invalid URL")) {
      throw error;
    }
    
    // Extract server details if available
    if (error.response && error.response.data) {
      const serverMsg = error.response.data.message || error.response.data.detail;
      if (serverMsg) {
        throw new Error(serverMsg);
      }
    }
    
    console.error("[Shortener API] Compression failed:", error.message);
    throw new Error(error.message || "Connection to shortening service failed.");
  }
}

export interface AnalyticsResponse {
  status: string;
  clickCount: number;
  short_code?: string;
  original_url?: string;
}

/**
 * Client-side analytics fetch — calls the FastAPI backend directly.
 * Uses NEXT_PUBLIC_BACKEND_URL so it works in browser (no server proxy hop).
 * GET /analytics/{short_code}
 */
export async function getAnalyticsClient(shortCode: string): Promise<AnalyticsResponse> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://fastapi-url-shortener-a6zc.onrender.com";

  // shortCode may be a full URL (e.g. "https://...onrender.com/X5Lv6").
  // Extract only the last path segment so we don't double-prefix the base URL.
  let code = shortCode;
  try {
    const parsed = new URL(shortCode);
    // e.g. pathname = "/X5Lv6" → "X5Lv6"
    code = parsed.pathname.replace(/^\/+/, "");
  } catch {
    // Not a URL — use shortCode as-is (already a bare code like "X5Lv6")
  }

  const res = await fetch(`${backendUrl}/analytics/${code}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Analytics fetch failed for ${code}: ${res.status}`);
  }
  return res.json();
}

/**
 * Server-side analytics fetch (via axios, for use in API routes / server actions).
 * GET /analytics/{short_code}
 */
export async function getAnalytics(shortCode: string): Promise<AnalyticsResponse> {
  try {
    const response = await api.get<AnalyticsResponse>(`/analytics/${shortCode}`);
    return response.data;
  } catch (error: any) {
    console.error(`[Shortener API] Analytics fetch failed for ${shortCode}:`, error.message);
    throw error;
  }
}

/**
 * Resolve short code details or follow redirect
 * GET /{short_code}
 */
export async function getRedirect(shortCode: string): Promise<any> {
  try {
    const response = await api.get(`/${shortCode}`);
    return response.data;
  } catch (error: any) {
    console.error(`[Shortener API] Redirect resolve failed for ${shortCode}:`, error.message);
    throw error;
  }
}
