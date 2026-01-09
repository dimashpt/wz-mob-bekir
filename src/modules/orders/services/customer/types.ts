import { PaginationResponse } from '@/@types/api';

export interface CustomerRequestParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_direction?: string;
  search?: string;
}

export interface CustomerResponse {
  data: Customer[];
  meta: PaginationResponse;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  total_orders: number;
  total_spent: number;
  formatted_total_spent: string;
  last_purchase_at: string;
  address: CustomerAddress;
  created_at: string;
  updated_at: string;
}

export interface CustomerAddress {
  street: string;
  subdistrict: string;
  district: string;
  city: string;
  state: string;
  postal_code: string;
  full_address: string;
}
