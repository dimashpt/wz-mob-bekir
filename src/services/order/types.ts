import { PaginationResponse } from '@/@types/api';

export type OrderRequestSearchKey =
  | 'order_code'
  | 'buyer_name'
  | 'tracking_number';

export type OrderRequestParams = {
  page?: number;
  per_page?: number;
  status?: OrderInternalStatus[];
  channel?: StorePlatform[];
  payment_method?: PaymentMethod[];
} & {
  [K in OrderRequestSearchKey as `search[${K}]`]?: string;
};

export interface OrderResponse {
  orders: Order[];
  page_info: PaginationResponse;
  meta: {
    unpaid: number;
    unmapped: number;
    to_process: number;
    out_of_stock: number;
    pending: number;
    in_process: number;
    ready_to_print: number;
    pending_waybill: number;
    ready_for_pickup: number;
    shipped_order: number;
    completed_order: number;
    return_order: number;
    cancelled_order: number;
    pending_logistic: number;
    unmapping_product: number;
    unmapping_location: number;
    shipping_completed_order: number;
    in_return: number;
    in_cancel: number;
    unmapping_delivery: number;
    draft: number;
    undefined_status: number;
    packed: number;
    issue: number;
    shipping_problem: number;
  };
}

export interface Order {
  order_header_id: number;
  order_code: string;
  original_order_code: string;
  store_id: number;
  store_name: string;
  location_id: number;
  location_name: string;
  location_type: string;
  origin_code: string;
  store_platform: StorePlatform;
  buyer_name: string;
  buyer_phone: string | null;
  recipient_name: string;
  recipient_phone: string;
  recipient_email: string | null;
  tracking_number: string;
  logistic_carrier: string;
  delivery_method: string;
  delivery: string;
  grand_total_order_price: string;
  cod_price: string;
  internal_status: OrderInternalStatus;
  external_status: string;
  cancel_sla_at: number;
  is_fake: boolean;
  pod_url: string | null;
  payment_method: PaymentMethod;
  shipping_label_url: string;
  created_at: string;
  updated_at: string;
  delivery_attempt: string | null;
  tx_id: string;
  package_weight: string;
  order_items: Orderitem[];
  destination_code: string | null;
}

export interface Orderitem {
  id: number;
  order_id: number;
  quantity: number;
  price: number;
  parent_sku: string | null;
  sku: string;
  name: string;
  is_cancel: boolean;
  is_oos: boolean;
  is_child: boolean;
}

export type PaymentMethod = 'COD' | 'NON COD' | 'DFOD';

export type StorePlatform =
  | 'shopee'
  | 'lazada'
  | 'tiktok'
  | 'tokopedia'
  | 'shopify'
  | 'other';

export type OrderInternalStatus =
  | 'Unpaid'
  | 'Draft'
  | 'To Process'
  | 'In Process'
  | 'Ready To Print'
  | 'Packed'
  | 'Ready For Pickup'
  | 'Shipped Order'
  | 'Shipping Completed Order'
  | 'Completed Order'
  | 'In Return'
  | 'Return Order'
  | 'Out Of Stock'
  | 'Unmapping Product'
  | 'Unmapping Location'
  | 'Unmapping Delivery'
  | 'Undefined Status'
  | 'In Cancel'
  | 'Cancelled Order';
