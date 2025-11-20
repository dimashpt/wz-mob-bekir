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

export interface PaginationResponse {
  total_record: number;
  size_per_page: number;
  last_page: number;
  current_page: number;
  previous_page: number | null;
  next_page: string;
  total_pages: number;
}
