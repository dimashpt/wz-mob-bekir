import { ChipVariant } from '@/components';
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

export const ORDER_PAYMENT_TYPES: Record<PaymentMethod, string> = {
  COD: 'COD',
  'NON COD': 'NON COD',
  DFOD: 'DFOD',
};

export const ORDER_PAYMENT_VIA: Record<
  keyof typeof ORDER_PAYMENT_TYPES,
  string[]
> = {
  'NON COD': ['Bank Transfer', 'Prepaid/E-Wallet', 'Virtual Account', 'QRIS'],
  COD: ['Tunai ke Kurir', 'Digital ke Kurir'],
  DFOD: ['Bayar Ongkir saat Terima'],
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
  offline: {
    label: 'Offline',
    value: 'offline',
  },
};

export const ORDER_FILTER_FIELDS = {
  order_code: 'orders.filter.order_code',
  tracking_number: 'orders.filter.tracking_number',
  buyer_name: 'orders.filter.buyer_name',
} as const;

export const ORDER_STATUS_CHIP_VARIANTS: Record<
  OrderInternalStatus,
  { variant: ChipVariant }
> = {
  // Draft
  Unpaid: { variant: 'gray' },
  Draft: { variant: 'gray' },

  // Fulfillment
  'To Process': { variant: 'blue' },
  'In Process': { variant: 'blue' },
  'Ready To Print': { variant: 'blue' },
  Packed: { variant: 'blue' },

  // Shipping
  'Ready For Pickup': { variant: 'blue' },
  'Shipped Order': { variant: 'blue' },
  'Shipping Completed Order': { variant: 'green' },

  // Completed
  'Completed Order': { variant: 'green' },
  'In Return': { variant: 'red' },
  'Return Order': { variant: 'red' },

  // Problems
  'Out Of Stock': { variant: 'red' },
  'Unmapping Product': { variant: 'red' },
  'Unmapping Location': { variant: 'red' },
  'Unmapping Delivery': { variant: 'red' },
  'Undefined Status': { variant: 'red' },

  // Cancelation
  'In Cancel': { variant: 'red' },
  'Cancelled Order': { variant: 'red' },
};

export const ORDER_STORE_PLATFORMS_LOGOS: Partial<
  Record<StorePlatform, string>
> = {
  shopee: require('@/assets/images/brands/shopee.webp'),
  lazada: require('@/assets/images/brands/lazada.webp'),
  tiktok: require('@/assets/images/brands/tiktok.webp'),
  tokopedia: require('@/assets/images/brands/tokopedia.webp'),
  shopify: require('@/assets/images/brands/shopify.webp'),
  offline: require('@/assets/images/brands/offline.png'),
};
