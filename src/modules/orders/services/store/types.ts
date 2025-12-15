import { PaginationResponse } from '@/@types/api';
import { StorePlatform } from '../order';

export interface StoreListRequestParams {
  page?: number;
  per_page?: number;
  sort_by?: 'updated_at' | 'created_at';
  sort_order?: 'asc' | 'desc';
  channels?: StorePlatform[];
}

export interface StoreListResponse {
  stores: Store[];
  page_info: PaginationResponse;
}

export interface Store {
  store_id: number;
  store_channel_id: string;
  alias: string;
  code: string;
  channel: StorePlatform;
  connection_status: string;
  sync_product: boolean;
  sync_order: boolean;
  sync_stock: boolean;
  is_fulfillment: boolean;
  chat_enabled: boolean;
  is_mwh: boolean;
  stock_validation: boolean;
  product_validation: boolean;
  order_accept: boolean;
  order_draft: boolean;
  connected_at: string;
  disconnected_at: string | null;
  last_sync_at: string;
  created_at: string;
  updated_at: string;
  partner_managed: boolean;
  partner_name: string | null;
  connection_expired_at: number;
  authorization: StoreAuthorization;
}

interface StoreAuthorization {
  store_channel_id: string;
  connection_expired_at: number;
  id: string;
}
