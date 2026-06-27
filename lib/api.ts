import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

// Reusable Axios instance pointing to the FastAPI backend
const backendUrl = process.env.BACKEND_URL || "https://fastapi-url-shortener-a6zc.onrender.com";

const api: AxiosInstance = axios.create({
  baseURL: backendUrl,
  timeout: 15000, // 15 seconds timeout to allow for Render.com spin-up latency
  headers: {
    "Content-Type": "application/json",
  },
});

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500; // Delay of 1.5 seconds between retries

// Response interceptor to handle automated retry logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as CustomRequestConfig;

    // Fail if config doesn't exist or is not modifiable
    if (!config) {
      return Promise.reject(error);
    }

    // Initialize retry counter
    config._retryCount = config._retryCount ?? 0;

    // Check if error is retryable: network errors (no response) or 5xx server errors
    const isNetworkError = !error.response;
    const isServerError = error.response && error.response.status >= 500;

    if ((isNetworkError || isServerError) && config._retryCount < MAX_RETRIES) {
      config._retryCount += 1;
      
      console.warn(
        `[Axios Retry] Request failed (${error.message}). Retrying attempt ${config._retryCount}/${MAX_RETRIES} in ${RETRY_DELAY_MS}ms...`
      );

      // Wait for delay
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

      // Re-execute request
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;
