// Shared types for the URL Shortener feature

export interface HistoryItem {
  id: string;
  original_url: string;
  short_code: string;
  created_at: string;
  clicks: number;
}
