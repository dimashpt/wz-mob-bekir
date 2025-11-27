import { PaginationResponse } from '@/@types/api';

export interface WarehouseListRequestParams {
  page?: number;
  per_page?: number;
}

export interface WarehouseListResponse {
  locations: Warehouse[];
  pagination: PaginationResponse;
}

interface Warehouse {
  id: number;
  name: string;
  code: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  subdistrict: string;
  district: null;
  country: string;
  pic_name: string;
  phone: string;
  latitude: string;
  longitude: string;
  is_default: boolean;
  is_pickup: boolean;
  is_return: boolean;
  origin_code: null;
  status: string;
  created_at: string;
  created_by: string;
}
