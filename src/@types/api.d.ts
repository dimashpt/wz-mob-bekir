export interface SuccessResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface ErrorResponse<T = unknown> {
  data: T;
  errors?: string;
  message?: string;
  request_id: string;
  status: number;
}
