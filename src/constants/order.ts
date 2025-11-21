import {
  OrderInternalStatus,
  PaymentMethod,
  StorePlatform,
} from '@/services/order';

export const ORDER_INTERNAL_STATUS: Record<OrderInternalStatus, string> = {
  // Draft
  Unpaid: 'orders.status.unpaid',
  Draft: 'orders.status.draft',

  // Fulfillment
  'To Process': 'orders.status.to_process',
  'In Process': 'orders.status.in_process',
  'Ready To Print': 'orders.status.ready_to_print',
  Packed: 'orders.status.packed',

  // Shipping
  'Ready For Pickup': 'orders.status.ready_for_pickup',
  'Shipped Order': 'orders.status.shipped_order',
  'Shipping Completed Order': 'orders.status.shipping_completed_order',

  // Completed
  'Completed Order': 'orders.status.completed_order',
  'In Return': 'orders.status.in_return',
  'Return Order': 'orders.status.return_order',

  // Problems
  'Out Of Stock': 'orders.status.out_of_stock',
  'Unmapping Product': 'orders.status.unmapping_product',
  'Unmapping Location': 'orders.status.unmapping_location',
  'Unmapping Delivery': 'orders.status.unmapping_delivery',
  'Undefined Status': 'orders.status.undefined_status',

  // Cancelation
  'In Cancel': 'orders.status.in_cancel',
  'Cancelled Order': 'orders.status.cancelled_order',
};

export const ORDER_PAYMENT_METHODS: Record<PaymentMethod, string> = {
  COD: 'COD',
  'NON COD': 'NON COD',
  DFOD: 'DFOD',
};

export const ORDER_STORE_PLATFORMS: Record<
  StorePlatform,
  { label: string; value: StorePlatform }
> = {
  shopee: {
    label: 'Shopee',
    value: 'shopee',
  },
  lazada: {
    label: 'Lazada',
    value: 'lazada',
  },
  tiktok: {
    label: 'Tiktok',
    value: 'tiktok',
  },
  tokopedia: {
    label: 'Tokopedia',
    value: 'tokopedia',
  },
  shopify: {
    label: 'Shopify',
    value: 'shopify',
  },
  other: {
    label: 'Other',
    value: 'other',
  },
};

export const ORDER_FILTER_FIELDS = {
  order_code: 'orders.filter.order_code',
  tracking_number: 'orders.filter.tracking_number',
  buyer_name: 'orders.filter.buyer_name',
} as const;
