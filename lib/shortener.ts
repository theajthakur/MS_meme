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
