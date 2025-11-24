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
  start_date?: string;
  end_date?: string;
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

export interface OrderDetailsResponse {
  order: OrderDetails;
}

export interface OrderDetails {
  order_header_id: number;
  order_code: string;
  original_order_code: string;
  store_id: number;
  tx_id: string;
  store_name: string;
  store_platform: StorePlatform;
  internal_status: OrderInternalStatus;
  external_status: string;
  location_id: number;
  location_name: string;
  address: string;
  location_city: string;
  location_postal_code: string;
  location_province: string;
  location_country: string;
  origin_code: string;
  checkout_at: number;
  payment_method: string;
  buyer_remarks: string;
  cancel_by: null;
  cancel_reason: null;
  return_reason: null;
  cod_price_type: null;
  buyer_name: string;
  buyer_phone: null;
  buyer_email: null;
  buyer_full_address: null;
  package_weight: string;
  package_length: string;
  package_width: string;
  package_height: string;
  chargeable_weight: string;
  delivery_method: string;
  delivery: string;
  logistic_provider_name: string;
  logistic_service_name: string;
  logistic_carrier: string;
  tracking_number: null;
  recipient_name: string;
  recipient_phone: string;
  recipient_area: null;
  recipient_subdistrict: null;
  recipient_district: string;
  recipient_city: string;
  recipient_province: string;
  recipient_country: string;
  recipient_email: null;
  recipient_postal_code: string;
  recipient_full_address: string;
  recipient_remarks: null;
  sub_total_price: string;
  shipping_price: string;
  other_price: string;
  total_discount_price: string;
  grand_total_order_price: string;
  cod_fee: string;
  cod_price: string;
  discount_shipping: string;
  discount_seller: string;
  packing_price: string;
  insurance_price: string;
  service_fee: string;
  stock_checked: boolean;
  created_at: string;
  updated_at: string;
  created_via: string;
  sales_pic: null;
  created_by: string;
  updated_by: string;
  payment_via: string;
  dropshipper_name: null;
  dropshipper_phone: null;
  dropshipper_email: null;
  dropshipper_full_address: null;
  is_dropship: boolean;
  pod_url: null;
  shipping_label_url: null;
  is_fake: boolean;
  returned_at: null;
  return_by: null;
  return_price: string;
  cancelled_at: null;
  actual_shipping_price: string;
  actual_package_weight: string;
  delivery_attempt: null;
  location_address: string;
  discount_shipping_by_seller: boolean;
  is_insurance: boolean;
  active_products: OrderProduct[];
  cancel_products: OrderProduct[];
  destination_code: null;
}

interface OrderProduct {
  order_detail_id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  product_name: string;
  sku: string;
  is_cancel: boolean;
  product_type: string;
  media_url: string;
  media_name: string;
  unit_weight: string;
  sub_total_product_price: string;
  product_clasification: string;
}
