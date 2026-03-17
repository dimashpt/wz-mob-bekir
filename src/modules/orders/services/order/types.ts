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
  | 'offline'
  | 'website';

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
  | 'Cancelled Order'
  | 'Pending Logistic';

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
  cancel_by: string | null;
  cancel_reason: string | null;
  return_reason: string | null;
  cod_price_type: string | null;
  buyer_name: string;
  buyer_phone: string | null;
  buyer_email: string | null;
  buyer_full_address: string | null;
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
  tracking_number: string | null;
  recipient_name: string;
  recipient_phone: string;
  recipient_area: string | null;
  recipient_subdistrict: string | null;
  recipient_district: string;
  recipient_city: string;
  recipient_province: string;
  recipient_country: string;
  recipient_email: string | null;
  recipient_postal_code: string;
  recipient_full_address: string;
  recipient_remarks: string | null;
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
  sales_pic: string | null;
  created_by: string;
  updated_by: string;
  payment_via: string;
  dropshipper_name: string | null;
  dropshipper_phone: string | null;
  dropshipper_email: string | null;
  dropshipper_full_address: string | null;
  is_dropship: boolean;
  pod_url: string | null;
  shipping_label_url: string | null;
  is_fake: boolean;
  returned_at: string | null;
  return_by: string | null;
  return_price: string;
  cancelled_at: string | null;
  actual_shipping_price: string;
  actual_package_weight: string;
  delivery_attempt: string | null;
  location_address: string;
  discount_shipping_by_seller: boolean;
  is_insurance: boolean;
  active_products: OrderProduct[];
  cancel_products: OrderProduct[];
  destination_code: string | null;
}

export interface OrderProduct {
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

export interface OrderHistoryParams {
  page?: number;
  per_page?: number;
}

export interface OrderHistoryResponse {
  histories: OrderHistory[];
  page_info: PaginationResponse;
}

export interface OrderHistory {
  order_history_id: number;
  order_header_id: number;
  status: string;
  channel_status: string;
  activity: string;
  full_name: string;
  remarks: string | null;
  file_url: string | null;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AddressRequestParams {
  page?: number;
  per_page?: number;
  search?: string;
  search_by?: string;
}

export interface AddressResponse {
  destinations: Address[];
  pagination: PaginationResponse;
}

export interface Address {
  region_id: number;
  country: string;
  state: string;
  district: string;
  city: string;
  subdistrict: string;
  subdistrict_code: string;
  postcode: string;
  longitude: string;
  latitude: string;
  destination_id: number | null;
  destination_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderPayload {
  order_code: string;
  payment_method_type: string;
  payment_via: string;
  store_id: string;
  location_id: string;
  checkout_at: string;
  sales_pic: string;
  remarks: string;
  origin_code: string;
  destination_code: string;
  cod_percentage: number;
  insurance_percentage: number;
  dropshipper_name: string;
  dropshipper_phone: string;
  dropshipper_email: string;
  dropshipper_full_address: string;
  is_dropship: boolean;
  is_draft: boolean;
  is_unpaid: boolean;
  recipient: Recipient;
  buyer: Buyer;
  delivery: Delivery;
  products: Product[];
  package: Package;
  price: Price;
  internal_status?: 'Draft';
}

interface Price {
  sub_total_price: number;
  shipping_price: number;
  other_price: number;
  total_discount_price: number;
  cod_fee: number;
  cod_price: number;
  grand_total_order_price: number;
  discount_seller: number;
  discount_shipping: number;
  packing_price: number;
  insurance_price: number;
}

interface Package {
  weight: number;
  length: number;
  width: number;
  height: number;
}

interface Product {
  name: string;
  sku: string;
  product_id: number;
  unit_price: number;
  unit_weight: string;
  qty: number;
}

interface Delivery {
  logistic: string;
  delivery_method: 'SYSTEM-DELIVERY' | 'SELF-DELIVERY';
  logistic_provider_name: string;
  logistic_service_name: string;
  logistic_carrier: string;
  tracking_number: string;
}

interface Buyer {
  name: string;
  phone: string;
  email: string;
  full_address: string;
}

interface Recipient {
  name: string;
  phone: string;
  email: string;
  country: string;
  province: string;
  city: string;
  sub_district: string;
  district: string;
  postal_code: string;
  full_address: string;
  sub_district_id: string;
  remarks: string;
  recipient_sub_district_id: string;
}
