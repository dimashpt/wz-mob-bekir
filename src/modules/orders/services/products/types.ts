import { PaginationResponse } from '@/@types/api';

export interface ProductListRequestParams {
  page?: number;
  per_page?: number;
  sort_by?: 'created_at';
  sort_direction?: 'asc' | 'desc';
  search_by?: 'name';
  search?: string;
  status?: string;
  is_stock?: boolean;
  location_id?: number;
}

export interface ProductListResponse {
  products: Product[];
  pagination: PaginationResponse;
}

export interface Product {
  product_id: number;
  name: string;
  sku: string;
  brand: string | null;
  category_name: string;
  featured_image_url: string | null;
  weight: string;
  width: string;
  height: string;
  length: string;
  volume: number;
  is_bundle: boolean;
  cost_price: string;
  published_price: string;
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  mapping_count: number;
  available: number | null;
}
