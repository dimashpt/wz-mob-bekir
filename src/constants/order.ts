import { i18n } from '@/lib/i18n';
import {
  OrderInternalStatus,
  PaymentMethod,
  StorePlatform,
} from '@/services/order';

export const ORDER_INTERNAL_STATUS: Record<OrderInternalStatus, string> = {
  // Draft
  Unpaid: i18n.t('orders.status.unpaid'),
  Draft: i18n.t('orders.status.draft'),

  // Fulfillment
  'To Process': i18n.t('orders.status.to_process'),
  'In Process': i18n.t('orders.status.in_process'),
  'Ready To Print': i18n.t('orders.status.ready_to_print'),
  Packed: i18n.t('orders.status.packed'),

  // Shipping
  'Ready For Pickup': i18n.t('orders.status.ready_for_pickup'),
  'Shipped Order': i18n.t('orders.status.shipped_order'),
  'Shipping Completed Order': i18n.t('orders.status.shipping_completed_order'),

  // Completed
  'Completed Order': i18n.t('orders.status.completed_order'),
  'In Return': i18n.t('orders.status.in_return'),
  'Return Order': i18n.t('orders.status.return_order'),

  // Problems
  'Out Of Stock': i18n.t('orders.status.out_of_stock'),
  'Unmapping Product': i18n.t('orders.status.unmapping_product'),
  'Unmapping Location': i18n.t('orders.status.unmapping_location'),
  'Unmapping Delivery': i18n.t('orders.status.unmapping_delivery'),
  'Undefined Status': i18n.t('orders.status.undefined_status'),

  // Cancelation
  'In Cancel': i18n.t('orders.status.in_cancel'),
  'Cancelled Order': i18n.t('orders.status.cancelled_order'),
};

export const PAYMENT_METHODS: Record<PaymentMethod, string> = {
  COD: 'COD',
  'NON COD': 'NON COD',
  DFOD: 'DFOD',
};

export const STORE_PLATFORMS: Record<
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
