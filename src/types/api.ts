// Type definitions for API responses and requests

// Generic API response
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Error response
export interface ErrorResponse {
  success: false;
  message: string;
}

// Pagination parameters
export interface PaginationParams {
  pageSize?: string | number;
  page?: string | number;
}

// API request options
export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// Notification type
export interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  timestamp: number;
}

// Cluster data
export interface Cluster {
  name: string;
  region: string;
  status?: string;
}
