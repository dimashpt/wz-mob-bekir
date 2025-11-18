export interface SuccessResponse<T> {
  data: T;
  message: string;
  status: number;
  error: null;
}

export interface ErrorResponse<T = unknown> {
  data: T;
  errors?: Record<string, string[]> | string;
  error?: string;
  message?: string;
  request_id: string;
  status: number;
}
